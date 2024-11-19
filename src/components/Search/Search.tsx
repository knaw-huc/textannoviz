import { Base64 } from "js-base64";
import _ from "lodash";
import isEmpty from "lodash/isEmpty";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  projectConfigSelector,
  translateSelector,
  useProjectStore,
} from "../../stores/project.ts";
import {
  blankSearchQuery,
  FacetEntry,
  filterFacetsByType,
  SearchQuery,
  toRequestBody,
} from "../../stores/search/search-query-slice.ts";
import { useSearchStore } from "../../stores/search/search-store.ts";
import { addToUrlParams, getFromUrlParams } from "../../utils/UrlParamUtils.ts";
import { getElasticIndices, sendSearchQuery } from "../../utils/broccoli";
import { handleAbortControllerAbort } from "../../utils/handleAbortControllerAbort.ts";
import { SearchForm } from "./SearchForm.tsx";
import { SearchLoadingSpinner } from "./SearchLoadingSpinner.tsx";
import { SearchResults, SearchResultsColumn } from "./SearchResults.tsx";
import { useSearchResults } from "./useSearchResults.tsx";
import { createAggs } from "./util/createAggs.ts";
import { getFacets } from "./util/getFacets.ts";
import { getUrlQuery } from "./util/getUrlQuery.ts";

export const Search = () => {
  const projectConfig = useProjectStore(projectConfigSelector);
  const [isInit, setInit] = useState(false);
  const [isDirty, setDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isShowingResults, setShowingResults] = useState(false);
  const [keywordFacets, setKeywordFacets] = useState<FacetEntry[]>([]);
  const [urlParams, setUrlParams] = useSearchParams();
  const [defaultSearchQuery, setDefaultSearchQyery] = useState<
    Partial<SearchQuery>
  >({});
  const [selectedFacets, setSelectedFacets] = useState<SearchQuery>({
    dateFrom: "",
    dateTo: "",
    rangeFrom: "",
    rangeTo: "",
    fullText: "",
    terms: {},
  });
  const translate = useProjectStore(translateSelector);
  const {
    searchUrlParams,
    setSearchUrlParams,
    searchQuery,
    setSearchQuery,
    setSearchResults,
    addToHistory,
    toFirstPage,
    searchFacetTypes,
    setSearchFacetTypes,
  } = useSearchStore();

  const { getSearchResults } = useSearchResults();
  const skipUrlSyncRef = useRef(false);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    initSearch().catch(() => {
      handleAbortControllerAbort(signal);
    });

    /**
     * Initialize search page:
     * - set default config values
     * - fetch keyword and date facets
     * - set search params from url
     * - set search query from url
     * - when url contains full text query:
     *   - fetch search results
     */
    async function initSearch() {
      if (isInit) {
        return;
      }
      const queryDecoded = getUrlQuery(urlParams);

      const newIndices = await getElasticIndices(projectConfig, signal);
      if (!newIndices) {
        return toast(translate("NO_INDICES_FOUND"), { type: "error" });
      }
      const newFacetTypes = newIndices[projectConfig.elasticIndexName];
      const aggregations = createAggs(newFacetTypes, projectConfig);
      const newSearchParams = getFromUrlParams(searchUrlParams, urlParams);
      const newFacets = await getFacets(
        projectConfig,
        aggregations,
        searchQuery,
        signal,
      );

      const newDateFacets = filterFacetsByType(
        newFacetTypes,
        newFacets,
        "date",
      );

      const newKeywordFacets = filterFacetsByType(
        newFacetTypes,
        newFacets,
        "keyword",
      );
      const defaultSearchQuery = {
        ...blankSearchQuery,
        dateFrom: projectConfig.initialDateFrom,
        dateTo: projectConfig.initialDateTo,
        rangeFrom: projectConfig.initialRangeFrom,
        rangeTo: projectConfig.initialRangeTo,
      };
      const newSearchQuery: SearchQuery = {
        ...defaultSearchQuery,
        aggs: aggregations,
        ...queryDecoded,
      };

      if (!isEmpty(newDateFacets)) {
        newSearchQuery.dateFacet = newDateFacets?.[0]?.[0];
      }
      if (projectConfig.showSliderFacets) {
        newSearchQuery.rangeFacet = "text.tokenCount";
      }
      setKeywordFacets(newKeywordFacets);
      setSearchFacetTypes(newFacetTypes);
      setSearchUrlParams(newSearchParams);
      setDefaultSearchQyery(defaultSearchQuery);
      setSearchQuery(newSearchQuery);
      setSelectedFacets(newSearchQuery);
      setInit(true);
    }

    return () => {
      setInit(false);
      controller.abort("useEffect cleanup cycle");
    };
  }, []);

  // TODO: continue refactor work https://github.com/knaw-huc/textannoviz/pull/225
  const [isUrlParamsAndSearchResultsInit, setUrlParamsAndSearchResultsInit] =
    useState(false);

  // Run when init has finished and search results should be shown:
  // TODO: remove useEffect, split work between init and isDirty useEffect
  useEffect(() => {
    const aborter = new AbortController();

    if (!isInit) {
      return;
    }
    if (isUrlParamsAndSearchResultsInit) {
      return;
    }
    skipUrlSyncRef.current = true;

    const queryDecoded = getUrlQuery(urlParams);
    const newSearchQuery = {
      ...searchQuery,
      ...queryDecoded,
    };

    setSearchQuery(newSearchQuery);
    setSelectedFacets(newSearchQuery);

    if (isSearchableQuery(queryDecoded, defaultSearchQuery)) {
      doSearch();
    } else {
      setUrlParamsAndSearchResultsInit(true);
    }

    async function doSearch() {
      setIsLoading(true);
      const searchResults = await getSearchResults(
        searchFacetTypes,
        searchUrlParams,
        newSearchQuery,
        aborter.signal,
      );
      setIsLoading(false);
      if (searchResults) {
        setSearchResults(searchResults.results);
        setKeywordFacets(searchResults.facets);
      }
      setShowingResults(true);
      setUrlParamsAndSearchResultsInit(true);
    }

    return () => {
      setIsLoading(false);
      aborter.abort();
    };
  }, [urlParams, isInit, isUrlParamsAndSearchResultsInit]);

  //THIS ONE IS RUN MULTIPLE TIMES
  useEffect(() => {
    syncUrlWithSearchParams();

    function syncUrlWithSearchParams() {
      if (!isInit || skipUrlSyncRef.current) {
        skipUrlSyncRef.current = false;
        return;
      }

      const query = JSON.stringify(searchQuery);

      const newUrlParams = addToUrlParams(urlParams, {
        ...searchUrlParams,
        query: Base64.toBase64(query),
        indexName: projectConfig.elasticIndexName,
      });
      setUrlParams(newUrlParams);
    }
  }, [searchUrlParams, searchQuery, isInit]);

  // Run when user modifies search query or params:
  useEffect(() => {
    const aborter = new AbortController();
    if (isDirty) {
      searchWhenDirty();
    }

    async function searchWhenDirty() {
      const isEmptySearch =
        searchQuery.fullText.length === 0 &&
        !projectConfig.allowEmptyStringSearch;

      if (isEmptySearch) {
        toast(translate("NO_SEARCH_STRING"), {
          type: "warning",
        });
        setDirty(false);
        return;
      }

      setShowingResults(true);

      addToHistory(searchQuery);
      setSelectedFacets(searchQuery);

      setIsLoading(true);
      const searchResults = await getSearchResults(
        searchFacetTypes,
        searchUrlParams,
        searchQuery,
        aborter.signal,
      );
      setIsLoading(false);
      if (searchResults) {
        setSearchResults(searchResults.results);
        setKeywordFacets(searchResults.facets);
      }
      setDirty(false);
    }

    return () => {
      setIsLoading(false);
      aborter.abort();
    };
  }, [isDirty, searchQuery]);

  async function updateAggs(query: SearchQuery) {
    const newParams = {
      ...searchUrlParams,
      indexName: projectConfig.elasticIndexName,
      size: 0,
    };

    setIsLoading(true);
    const searchResults = await sendSearchQuery(
      projectConfig,
      newParams,
      toRequestBody(query),
    );
    setIsLoading(false);

    if (searchResults) {
      setKeywordFacets(
        filterFacetsByType(searchFacetTypes, searchResults.aggs, "keyword"),
      );
    }
  }

  function handleNewSearch() {
    toFirstPage();
    setDirty(true);
  }

  function handlePageChange() {
    setDirty(true);
  }

  return (
    <div>
      {isLoading && <SearchLoadingSpinner />}

      <div
        id="searchContainer"
        className="mx-auto flex h-full w-full grow flex-row content-stretch items-stretch self-stretch"
      >
        <SearchForm
          onSearch={handleNewSearch}
          keywordFacets={keywordFacets}
          searchQuery={searchQuery}
          updateAggs={updateAggs}
        />
        <SearchResultsColumn>
          {/* Wait for init, to prevent a flicker of info page before results are shown: */}
          {!isShowingResults && isInit && (
            <projectConfig.components.SearchInfoPage />
          )}
          {isShowingResults && (
            <SearchResults
              onSearch={handleNewSearch}
              onPageChange={handlePageChange}
              query={searchQuery}
              selectedFacets={selectedFacets}
            />
          )}
        </SearchResultsColumn>
      </div>
    </div>
  );
};

/**
 * Search when query differs from default query
 */
function isSearchableQuery(
  query: Partial<SearchQuery>,
  defaultQuery: Partial<SearchQuery>,
) {
  if (!query) {
    return false;
  }
  const keysToDiffer: (keyof SearchQuery)[] = [
    "fullText",
    "dateFrom",
    "dateTo",
    "terms",
  ];
  for (const key of keysToDiffer) {
    if (!_.isEqual(query[key], defaultQuery[key])) {
      return true;
    }
  }
  return false;
}
