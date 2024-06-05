import { Base64 } from "js-base64";
import isEmpty from "lodash/isEmpty";
import { useEffect, useState } from "react";
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
import { handleAbortControllerAbort } from "../../utils/handleAbortControllerAbort.ts";
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
      const newIndex: FacetNamesByType =
        newIndices[projectConfig.elasticIndexName];
      const newSearchParams = getFromUrlParams(searchUrlParams, urlParams);
      const newFacets = await getFacets(projectConfig, newIndex, signal);

      const newDateFacets = filterFacetsByType(newIndex, newFacets, "date");

      const newKeywordFacets = filterFacetsByType(
        newIndex,
        newFacets,
        "keyword",
      );

      const aggregations = Object.keys(newFacets);

      // const keywordAggs = newKeywordFacets.map(
      //   (keywordFacet) => keywordFacet[0],
      // );

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
      setIndex(newIndex);
      setSearchUrlParams(newSearchParams);
      setSearchQuery(newSearchQuery);

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
      controller.abort("useEffect cleanup cycle");
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

      await getSearchResults(index, searchUrlParams, searchQuery, signal);
      setDirty(false);
    }

    return () => {
      controller.abort("useEffect cleanup cycle");
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
    // const target = document.getElementById("searchContainer");
    // if (target) {
    //   target.scrollIntoView({ behavior: "smooth" });
    // }
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
        {isShowingResults && <SearchResults onSearch={handleNewSearch} />}
      </SearchResultsColumn>
    </div>
  );
};
