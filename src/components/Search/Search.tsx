import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  projectConfigSelector,
  translateSelector,
  useProjectStore,
} from "../../stores/project.ts";
import { useSearchStore } from "../../stores/search/search-store.ts";
import { getElasticIndices, sendSearchQuery } from "../../utils/broccoli";
import { SearchForm } from "./SearchForm.tsx";
import { SearchResults, SearchResultsColumn } from "./SearchResults.tsx";
import { useSearchResults } from "./useSearchResults.tsx";
import { createAggs } from "./util/createAggs.ts";
import { getFacets } from "./util/getFacets.ts";
import { handleAbort } from "../../utils/handleAbort.tsx";
import { useSearchUrlParams } from "./useSearchUrlParams.tsx";
import { toRequestBody } from "../../stores/search/toRequestBody.ts";
import { filterFacetsByType } from "../../stores/search/filterFacetsByType.ts";
import { SearchQuery } from "../../model/Search.ts";
import _ from "lodash";

export const Search = () => {
  const projectConfig = useProjectStore(projectConfigSelector);
  const [isInit, setInit] = useState(false);
  const [isDirty, setDirty] = useState(false);
  const [isShowingResults, setShowingResults] = useState(false);
  const { searchQuery, updateSearchQuery, searchParams, toFirstPage } =
    useSearchUrlParams();

  const translate = useProjectStore(translateSelector);
  const {
    setSearchResults,
    updateSearchQueryHistory,
    searchFacetTypes,
    setSearchFacetTypes,
    setKeywordFacets,
    keywordFacets,
  } = useSearchStore();

  const { getSearchResults } = useSearchResults();

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

      const newSearchQuery: SearchQuery = {
        ...searchQuery,
        aggs: aggregations,
        dateFrom: projectConfig.initialDateFrom,
        dateTo: projectConfig.initialDateTo,
        rangeFrom: projectConfig.initialRangeFrom,
        rangeTo: projectConfig.initialRangeTo,
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

      if (newSearchQuery?.fullText) {
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
    if (!isInit) {
      return;
    }

    async function doSearch() {
      console.log("doSearch", searchQuery.fullText);
      const searchResults = await getSearchResults(
        searchFacetTypes,
        searchParams,
        searchQuery,
      );
      if (searchResults) {
        setSearchResults(searchResults.results);
        setKeywordFacets(searchResults.facets);
      }
      setShowingResults(true);
    }

    if (searchQuery?.fullText) {
      doSearch();
    }
  }, [searchParams, searchQuery, isInit]);

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
        searchParams,
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
      ...searchParams,
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
