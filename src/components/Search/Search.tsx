import {Base64} from "js-base64";
import React, {useEffect} from "react";
import {useSearchParams} from "react-router-dom";
import {Facets} from "../../model/Search";
import {projectConfigSelector, translateSelector, useProjectStore,} from "../../stores/project.ts";
import {useSearchStore} from "../../stores/search/search-store.ts";
import {getElasticIndices, sendSearchQuery} from "../../utils/broccoli";
import {SearchResults} from "./SearchResults.tsx";
import {queryBodySelector, SearchQuery} from "../../stores/search/search-query-slice.ts";
import {createHighlights} from "./util/createHighlights.ts";
import {QUERY} from "./SearchUrlParams.ts";
import {addToUrlParams, getFromUrlParams} from "../../utils/UrlParamUtils.tsx";
import {SearchForm} from "./SearchForm.tsx";
import {toast} from "react-toastify";

export const Search = () => {
  const projectConfig = useProjectStore(projectConfigSelector);
  const [isInit, setInit] = React.useState(false);
  const [isDirty, setDirty] = React.useState(false);
  const [facets, setFacets] = React.useState<Facets>({});
  const [urlParams, setUrlParams] = useSearchParams();
  const translate = useProjectStore(translateSelector);
  const {
    searchUrlParams, setSearchUrlParams,
    searchQuery, setSearchQuery,
    setSearchResults,
    setTextToHighlight,
    updateSearchQueryHistory
  } = useSearchStore();
  const searchQueryRequestBody = useSearchStore(queryBodySelector);

  useEffect(() => {
    initSearch();

    /**
     * Initialize search page:
     * - Initialize search url params and query from url and default config values
     * - Fetch indices and facets
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
        ...queryDecoded
      };
      const newIndices = await getElasticIndices(projectConfig);
      if (!newIndices) {
        return toast(translate('NO_INDICES_FOUND'), { type: "error" });
      }
      newSearchQuery.index = newIndices[projectConfig.elasticIndexName];
      const newSearchParams = getFromUrlParams(searchUrlParams, urlParams);

      setSearchUrlParams(newSearchParams);
      setSearchQuery(newSearchQuery);
      setInit(true);
      setDirty(true);
    }

  }, []);

  useEffect(() => {
    syncUrlWithSearchParams();

    function syncUrlWithSearchParams() {
      const cleanQuery = JSON.stringify(searchQuery, skipEmptyValues);
      function skipEmptyValues(_: string, v: any) {
        return [null, ""].includes(v) ? undefined : v;
      }
      const newUrlParams = addToUrlParams(urlParams, {
        ...searchUrlParams,
        query: Base64.toBase64(cleanQuery)
      });
      setUrlParams(newUrlParams);
    }
  }, [searchUrlParams, searchQuery]);

  useEffect(() => {
    searchWhenDirty();

    async function searchWhenDirty() {
      if (!isDirty) {
        return;
      }
      if (!searchQuery.terms) {
        return;
      }
      const searchResults = await sendSearchQuery(projectConfig, searchUrlParams, searchQueryRequestBody);
      if (!searchResults) {
        return;
      }
      const data = await sendSearchQuery(projectConfig, searchUrlParams, {});
      const newFacets = data?.aggs;
      if(!newFacets) {
        return toast(translate('NO_FACETS_FOUND'), { type: "error" });
      }

      const target = document.getElementById("searchContainer");
      if (target) {
        target.scrollIntoView({behavior: "smooth"});
      }

      setFacets(newFacets);
      setTextToHighlight(createHighlights(searchResults));
      setSearchResults(searchResults);
      setSearchUrlParams({...searchUrlParams});
      updateSearchQueryHistory(searchQuery);
      setDirty(false);
    }
  }, [isDirty]);

  function getUrlQuery(urlParams: URLSearchParams): Partial<SearchQuery> {
    const queryEncoded = urlParams.get(QUERY);
    return queryEncoded && JSON.parse(Base64.fromBase64(queryEncoded));
  }

  return (
      <div
          id="searchContainer"
          className="mx-auto flex h-full w-full grow flex-row content-stretch items-stretch self-stretch"
      >
        <SearchForm
            setDirty={setDirty}
            facets={facets}
        />
        <SearchResults
            setDirty={setDirty}
            facets={facets}
        />
      </div>
  );
}
