import { useEffect, useState } from "react";
import _ from "lodash";
import { toast } from "react-toastify";
import {
  projectConfigSelector,
  translateSelector,
  useProjectStore,
} from "../../stores/project.ts";
import { useSearchStore } from "../../stores/search/search-store.ts";
import { getElasticIndices, sendSearchQuery } from "../../utils/broccoli";
import { SearchForm } from "./SearchForm.tsx";
import { SearchLoadingSpinner } from "./SearchLoadingSpinner.tsx";
import { SearchResults, SearchResultsColumn } from "./SearchResults.tsx";
import { useSearchResults } from "./useSearchResults.tsx";
import { createAggs } from "./util/createAggs.ts";
import { getFacets } from "./util/getFacets.ts";
import { handleAbort } from "../../utils/handleAbort.tsx";
import { blankSearchQuery, useSearchUrlParams } from "./useSearchUrlParams.tsx";
import { toRequestBody } from "../../stores/search/toRequestBody.ts";
import { filterFacetsByType } from "../../stores/search/filterFacetsByType.ts";
import { SearchQuery } from "../../model/Search.ts";

export const Search = () => {
  const projectConfig = useProjectStore(projectConfigSelector);
  const [isInit, setInit] = useState(false);
  const [isDirty, setDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isShowingResults, setShowingResults] = useState(false);
  const { searchQuery, updateSearchQuery, searchParams, toFirstPage } =
    useSearchUrlParams();

  const translate = useProjectStore(translateSelector);
  const {
    setSearchResults,
    searchFacetTypes,
    setSearchFacetTypes,
    setKeywordFacets,
    keywordFacets,
    addToHistory,
  } = useSearchStore();

  const { getSearchResults } = useSearchResults();

  useEffect(() => {
    /**
     * Initialize search page:
     * - set default config values
     * - fetch keyword and date facets
     * - set search params from url
     * - set search query from url
     * - when url contains full text query:
     *   - fetch search results
     */
    const aborter = new AbortController();

    if (!isInit) {
      initSearch().catch(handleAbort);
    }

    async function initSearch() {
      const newIndices = await getElasticIndices(projectConfig, aborter.signal);
      if (!newIndices) {
        return toast(translate("NO_INDICES_FOUND"), { type: "error" });
      }
      const newFacetTypes = newIndices[projectConfig.elasticIndexName];
      const aggregations = createAggs(newFacetTypes, projectConfig);
      const newFacets = await getFacets(
        projectConfig,
        aggregations,
        searchQuery,
        aborter.signal,
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
      };

      if (!_.isEmpty(newDateFacets)) {
        newSearchQuery.dateFacet = newDateFacets?.[0]?.[0];
      }
      if (projectConfig.showSliderFacets) {
        newSearchQuery.rangeFacet = "text.tokenCount";
      }
      setKeywordFacets(newKeywordFacets);
      setSearchFacetTypes(newFacetTypes);
      updateSearchQuery(newSearchQuery);
      if (isSearchableQuery(newSearchQuery, defaultSearchQuery)) {
        const searchResults = await getSearchResults(
          newFacetTypes,
          searchParams,
          newSearchQuery,
          aborter.signal,
        );
        if (searchResults) {
          setSearchResults(searchResults.results);
          setKeywordFacets(searchResults.facets);
        }
        setShowingResults(true);
      }

      setInit(true);
    }

    return () => {
      setInit(false);
      aborter.abort();
    };
  }, []);

  useEffect(() => {
    const aborter = new AbortController();
    if (isDirty) {
      searchWhenDirty().catch(handleAbort);
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

      setIsLoading(true);
      const searchResults = await getSearchResults(
        searchFacetTypes,
        searchParams,
        searchQuery,
        aborter.signal,
      );
      setIsLoading(false);

      if (searchResults) {
        setSearchResults(searchResults.results);
        setKeywordFacets(searchResults.facets);
      }

      addToHistory(searchQuery);
      setShowingResults(true);
      setDirty(false);
    }

    return () => {
      setIsLoading(false);
      aborter.abort();
    };
  }, [isDirty, searchQuery, searchParams]);

  async function updateAggs(query: SearchQuery) {
    const newParams = {
      ...searchParams,
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
