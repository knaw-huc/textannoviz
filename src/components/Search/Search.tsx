import { Base64 } from "js-base64";
import isEmpty from "lodash/isEmpty";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FacetNamesByType } from "../../model/Search";
import {
  projectConfigSelector,
  translateSelector,
  useProjectStore,
} from "../../stores/project.ts";
import { SearchUrlParams } from "../../stores/search/search-params-slice.ts";
import {
  FacetEntry,
  SearchQuery,
  filterFacetsByType,
  toRequestBody,
} from "../../stores/search/search-query-slice.ts";
import { useSearchStore } from "../../stores/search/search-store.ts";
import { addToUrlParams, getFromUrlParams } from "../../utils/UrlParamUtils.ts";
import { getElasticIndices, sendSearchQuery } from "../../utils/broccoli";
import { SearchForm } from "./SearchForm.tsx";
import { SearchResults, SearchResultsColumn } from "./SearchResults.tsx";
import { createHighlights } from "./util/createHighlights.ts";
import { getFacets } from "./util/getFacets.ts";
import { getUrlQuery } from "./util/getUrlQuery.ts";

export const Search = () => {
  const projectConfig = useProjectStore(projectConfigSelector);
  const [isInit, setInit] = useState(false);
  const [isDirty, setDirty] = useState(false);
  const [isShowingResults, setShowingResults] = useState(false);
  const [keywordFacets, setKeywordFacets] = useState<FacetEntry[]>([]);
  const [index, setIndex] = useState<FacetNamesByType>({});
  const [urlParams, setUrlParams] = useSearchParams();
  const [selectedFacets, setSelectedFacets] = React.useState<SearchQuery>({
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
    setTextToHighlight,
    updateSearchQueryHistory,
    resetPage,
  } = useSearchStore();

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    initSearch().catch((error) => {
      console.error(error);
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

      const newSearchQuery: SearchQuery = {
        ...searchQuery,
        dateFrom: projectConfig.initialDateFrom,
        dateTo: projectConfig.initialDateTo,
        rangeFrom: projectConfig.initialRangeFrom,
        rangeTo: projectConfig.initialRangeTo,
        ...queryDecoded,
      };
      const newIndices = await getElasticIndices(projectConfig, signal);
      if (!newIndices) {
        return toast(translate("NO_INDICES_FOUND"), { type: "error" });
      }
      const newSearchParams = getFromUrlParams(searchUrlParams, urlParams);
      const newFacets = await getFacets(projectConfig, signal);
      const newIndex = newIndices[projectConfig.elasticIndexName];
      const newDateFacets = filterFacetsByType(newIndex, newFacets, "date");
      if (!isEmpty(newDateFacets)) {
        newSearchQuery.dateFacet = newDateFacets?.[0]?.[0];
      }
      if (projectConfig.showSliderFacets) {
        newSearchQuery.rangeFacet = "text.tokenCount";
      }
      const newKeywordFacets = filterFacetsByType(
        newIndex,
        newFacets,
        "keyword",
      );

      setKeywordFacets(newKeywordFacets);
      setIndex(newIndex);
      setSearchUrlParams(newSearchParams);
      setSearchQuery(newSearchQuery);
      setSelectedFacets(newSearchQuery);

      if (queryDecoded?.fullText) {
        await getSearchResults(
          newIndex,
          newSearchParams,
          newSearchQuery,
          signal,
        );
        setShowingResults(true);
      }

      setInit(true);
    }
    return () => {
      controller.abort();
    };
  }, []);

  //THIS ONE IS RUN MULTIPLE TIMES
  useEffect(() => {
    syncUrlWithSearchParams();

    function syncUrlWithSearchParams() {
      if (!isInit) {
        return;
      }
      const cleanQuery = JSON.stringify(searchQuery, skipEmptyValues);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      function skipEmptyValues(_: string, v: any) {
        return [null, ""].includes(v) ? undefined : v;
      }

      const newUrlParams = addToUrlParams(urlParams, {
        ...searchUrlParams,
        query: Base64.toBase64(cleanQuery),
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
      if (
        searchQuery.fullText.length === 0 &&
        !projectConfig.allowEmptyStringSearch
      ) {
        toast(translate("NO_SEARCH_STRING"), {
          type: "warning",
        });
        setDirty(false);
        return;
      }

      setShowingResults(true);

      updateSearchQueryHistory(searchQuery);
      setSelectedFacets(searchQuery);

      await getSearchResults(index, searchUrlParams, searchQuery, signal);
      setDirty(false);
    }

    return () => {
      controller.abort();
    };
  }, [isDirty]);

  async function getSearchResults(
    facetsByType: FacetNamesByType,
    params: SearchUrlParams,
    query: SearchQuery,
    signal: AbortSignal,
  ) {
    if (!searchQuery.terms) {
      return;
    }

    const newParams = { ...params, indexName: projectConfig.elasticIndexName };

    let exactSearch = false;

    if (query.fullText.startsWith('"')) {
      exactSearch = true;
    }

    const searchResults = await sendSearchQuery(
      projectConfig,
      newParams,
      toRequestBody(query),
      signal,
    );
    if (!searchResults) {
      return;
    }
    setSearchResults(searchResults);
    setKeywordFacets(
      filterFacetsByType(facetsByType, searchResults.aggs, "keyword"),
    );
    setTextToHighlight(createHighlights(searchResults, exactSearch));
    const target = document.getElementById("searchContainer");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  }

  function handleNewSearch(stayOnPage?: boolean) {
    if (!stayOnPage) {
      resetPage();
    }

    setDirty(true);
  }

  return (
    <div
      id="searchContainer"
      className="mx-auto flex h-full w-full grow flex-row content-stretch items-stretch self-stretch"
    >
      <SearchForm onSearch={handleNewSearch} keywordFacets={keywordFacets} />
      <SearchResultsColumn>
        {/* Wait for init, to prevent a flicker of info page before results are shown: */}
        {!isShowingResults && isInit && (
          <projectConfig.components.SearchInfoPage />
        )}
        {isShowingResults && (
          <SearchResults
            onSearch={handleNewSearch}
            selectedFacets={selectedFacets}
          />
        )}
      </SearchResultsColumn>
    </div>
  );
};
