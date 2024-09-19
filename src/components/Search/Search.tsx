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
  FacetEntry,
  filterFacetsByType,
  SearchQuery,
  toRequestBody,
} from "../../stores/search/search-query-slice.ts";
import { useSearchStore } from "../../stores/search/search-store.ts";
import { addToUrlParams, getFromUrlParams } from "../../utils/UrlParamUtils.ts";
import { getElasticIndices, sendSearchQuery } from "../../utils/broccoli";
import { handleAbortControllerAbort } from "../../utils/handleAbortControllerAbort.ts";
import { dummyIndex } from "./DummyIndex.ts";
import { SearchForm } from "./SearchForm.tsx";
import { SearchResults, SearchResultsColumn } from "./SearchResults.tsx";
import { useSearchResults } from "./useSearchResults.tsx";
import { createAggs } from "./util/createAggs.ts";
// import { getFacets } from "./util/getFacets.ts";
import { dummyAggs } from "./DummyAggs.ts";
import { getUrlQuery } from "./util/getUrlQuery.ts";

export const Search = () => {
  const projectConfig = useProjectStore(projectConfigSelector);
  const [isInit, setInit] = useState(false);
  const [isDirty, setDirty] = useState(false);
  const [isShowingResults, setShowingResults] = useState(false);
  const [checkboxFacets, setCheckboxFacets] = useState<FacetEntry[]>([]);
  const [urlParams, setUrlParams] = useSearchParams();
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
    updateSearchQueryHistory,
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
      // const newFacetTypes = newIndices[projectConfig.elasticIndexName];
      const newFacetTypes = dummyIndex;
      const aggregations = createAggs(newFacetTypes, projectConfig);
      console.log(aggregations);
      const newSearchParams = getFromUrlParams(searchUrlParams, urlParams);
      // const newFacets = await getFacets(
      //   projectConfig,
      //   aggregations,
      //   searchQuery,
      //   signal,
      // );
      const newFacets = dummyAggs;

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

      const newCheckboxFacets = newKeywordFacets;

      console.log(newCheckboxFacets);

      console.log(_.at(dummyIndex, ["attendants", "entities"]));

      const newSearchQuery: SearchQuery = {
        ...searchQuery,
        aggs: aggregations,
        dateFrom: projectConfig.initialDateFrom,
        dateTo: projectConfig.initialDateTo,
        rangeFrom: projectConfig.initialRangeFrom,
        rangeTo: projectConfig.initialRangeTo,
        ...queryDecoded,
      };

      if (!isEmpty(newDateFacets)) {
        newSearchQuery.dateFacet = newDateFacets?.[0]?.[0];
      }
      if (projectConfig.showSliderFacets) {
        newSearchQuery.rangeFacet = "text.tokenCount";
      }

      setCheckboxFacets(newCheckboxFacets);
      setSearchFacetTypes(newFacetTypes);
      setSearchUrlParams(newSearchParams);
      setSearchQuery(newSearchQuery);
      setSelectedFacets(newSearchQuery);

      if (queryDecoded?.fullText) {
        const searchResults = await getSearchResults(
          newFacetTypes,
          newSearchParams,
          newSearchQuery,
          signal,
        );
        if (searchResults) {
          setSearchResults(searchResults.results);
          setCheckboxFacets(searchResults.facets);
        }
        setShowingResults(true);
      }

      setInit(true);
    }

    return () => {
      setInit(false);
      controller.abort("useEffect cleanup cycle");
    };
  }, []);

  useEffect(() => {
    if (!isInit) {
      return;
    }

    const queryDecoded = getUrlQuery(urlParams);
    const newSearchQuery = {
      ...searchQuery,
      ...queryDecoded,
    };

    async function doSearch() {
      const searchResults = await getSearchResults(
        searchFacetTypes,
        searchUrlParams,
        newSearchQuery,
      );
      if (searchResults) {
        setSearchResults(searchResults.results);
        setCheckboxFacets(searchResults.facets);
      }
      setShowingResults(true);
    }

    skipUrlSyncRef.current = true;

    setSearchQuery(newSearchQuery);
    setSelectedFacets(newSearchQuery);

    if (
      queryDecoded?.fullText &&
      JSON.stringify(searchQuery) !== JSON.stringify(queryDecoded)
    ) {
      doSearch();
    }
  }, [urlParams, isInit]);

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

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
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

      updateSearchQueryHistory(searchQuery);
      setSelectedFacets(searchQuery);

      const searchResults = await getSearchResults(
        searchFacetTypes,
        searchUrlParams,
        searchQuery,
        signal,
      );
      if (searchResults) {
        setSearchResults(searchResults.results);
        setCheckboxFacets(searchResults.facets);
      }
      setDirty(false);
    }

    return () => {
      controller.abort("useEffect cleanup cycle");
    };
  }, [isDirty]);

  async function updateAggs(query: SearchQuery) {
    const newParams = {
      ...searchUrlParams,
      indexName: projectConfig.elasticIndexName,
      size: 0,
    };

    const searchResults = await sendSearchQuery(
      projectConfig,
      newParams,
      toRequestBody(query),
    );

    if (!searchResults) {
      return;
    }

    setCheckboxFacets(
      filterFacetsByType(searchFacetTypes, searchResults.aggs, "keyword"),
    );
  }

  function handleNewSearch() {
    toFirstPage();
    setDirty(true);
  }

  function handlePageChange() {
    setDirty(true);
  }

  return (
    <div
      id="searchContainer"
      className="mx-auto flex h-full w-full grow flex-row content-stretch items-stretch self-stretch"
    >
      <SearchForm
        onSearch={handleNewSearch}
        checkboxFacets={checkboxFacets}
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
  );
};
