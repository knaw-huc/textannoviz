import { Base64 } from "js-base64";
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
  filterFacetsByType,
  SearchQuery,
  toRequestBody,
} from "../../stores/search/search-query-slice.ts";
import { useSearchStore } from "../../stores/search/search-store.ts";
import { addToUrlParams, getFromUrlParams } from "../../utils/UrlParamUtils.ts";
import { getElasticIndices, sendSearchQuery } from "../../utils/broccoli";
import { SearchForm } from "./SearchForm.tsx";
import { SearchResults, SearchResultsColumn } from "./SearchResults.tsx";
import { useSearchResults } from "./useSearchResults.tsx";
import { createAggs } from "./util/createAggs.ts";
import { getFacets } from "./util/getFacets.ts";
import { getUrlQuery } from "./util/getUrlQuery.ts";
import { handleAbort } from "../../utils/handleAbort.tsx";

export const Search = () => {
  const projectConfig = useProjectStore(projectConfigSelector);
  const [isInit, setInit] = useState(false);
  const [isDirty, setDirty] = useState(false);
  const [isShowingResults, setShowingResults] = useState(false);
  const [urlParams, setUrlParams] = useSearchParams();

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
    setKeywordFacets,
    keywordFacets,
  } = useSearchStore();

  const { getSearchResults } = useSearchResults();
  const skipUrlSyncRef = useRef(false);

  useEffect(() => {
    const aborter = new AbortController();
    initSearch().catch(handleAbort);

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

      const newIndices = await getElasticIndices(projectConfig, aborter.signal);
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

      setKeywordFacets(newKeywordFacets);
      setSearchFacetTypes(newFacetTypes);
      setSearchUrlParams(newSearchParams);
      setSearchQuery(newSearchQuery);

      if (queryDecoded?.fullText) {
        const searchResults = await getSearchResults(
          newFacetTypes,
          newSearchParams,
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
        setKeywordFacets(searchResults.facets);
      }
      setShowingResults(true);
    }

    skipUrlSyncRef.current = true;

    setSearchQuery(newSearchQuery);

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

      setShowingResults(true);

      updateSearchQueryHistory(searchQuery);

      const searchResults = await getSearchResults(
        searchFacetTypes,
        searchUrlParams,
        searchQuery,
        aborter.signal,
      );
      if (searchResults) {
        setSearchResults(searchResults.results);
        setKeywordFacets(searchResults.facets);
      }
      setDirty(false);
    }

    return () => aborter.abort();
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

    setKeywordFacets(
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
        keywordFacets={keywordFacets}
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
  );
};
