import {Base64} from "js-base64";
import {useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";
import {Facets} from "../../model/Search";
import {projectConfigSelector, translateSelector, useProjectStore,} from "../../stores/project.ts";
import {useSearchStore} from "../../stores/search/search-store.ts";
import {getElasticIndices, sendSearchQuery} from "../../utils/broccoli";
import {SearchResults, SearchResultsColumn} from "./SearchResults.tsx";
import {filterFacetsByType, queryBodySelector, SearchQuery} from "../../stores/search/search-query-slice.ts";
import {createHighlights} from "./util/createHighlights.ts";
import {QUERY} from "./SearchUrlParams.ts";
import {addToUrlParams, getFromUrlParams} from "../../utils/UrlParamUtils.tsx";
import {SearchForm} from "./SearchForm.tsx";
import {toast} from "react-toastify";
import {SearchUrlParams} from "../../stores/search/search-params-slice.ts";
import {ProjectConfig} from "../../model/ProjectConfig.ts";

export const Search = () => {
  const projectConfig = useProjectStore(projectConfigSelector);
  const [isInit, setInit] = useState(false);
  const [isDirty, setDirty] = useState(false);
  const [isShowingResults, setShowingResults] = useState(false);
  const [facets, setFacets] = useState<Facets>({});
  const [urlParams, setUrlParams] = useSearchParams();
  const translate = useProjectStore(translateSelector);
  const {
    searchUrlParams, setSearchUrlParams,
    searchQuery, setSearchQuery,
    setSearchResults,
    setTextToHighlight,
    updateSearchQueryHistory,
    resetPage
  } = useSearchStore();
  const searchQueryRequestBody = useSearchStore(queryBodySelector);

  useEffect(() => {
    initSearch();

    /**
     * Initialize search page:
     * - default config values
     * - search index
     * - search url params
     * - query from url
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
        return toast(translate('NO_INDICES_FOUND'), {type: "error"});
      }
      const newSearchParams = getFromUrlParams(searchUrlParams, urlParams);
      const newFacets = await getFacets(projectConfig);
      setFacets(newFacets);
      newSearchQuery.index = newIndices[projectConfig.elasticIndexName];
      newSearchQuery.dateFacet = filterFacetsByType(newSearchQuery.index, newFacets, "date")?.[0]?.[0];

      setSearchUrlParams(newSearchParams);
      setSearchQuery(newSearchQuery);
      if (queryDecoded?.fullText) {
        await getSearchResults()
        setShowingResults(true);
      }
      setInit(true);
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
    if (isDirty) {
      searchWhenDirty();
    }

    async function searchWhenDirty() {
      await getSearchResults();
      updateSearchQueryHistory(searchQuery);
      setDirty(false);
    }

  }, [isDirty]);

  async function getSearchResults() {
    if (!searchQuery.terms) {
      return;
    }
    const searchResults = await sendSearchQuery(projectConfig, searchUrlParams, searchQueryRequestBody);
    if (!searchResults) {
      return;
    }
    setFacets(searchResults?.aggs);
    const target = document.getElementById("searchContainer");
    if (target) {
      target.scrollIntoView({behavior: "smooth"});
    }

    setTextToHighlight(createHighlights(searchResults));
    setSearchResults(searchResults);
  }

  function getUrlQuery(urlParams: URLSearchParams): Partial<SearchQuery> {
    const queryEncoded = urlParams.get(QUERY);
    return queryEncoded && JSON.parse(Base64.fromBase64(queryEncoded));
  }

  function handleNewSearch(stayOnPage?: boolean) {
    if (!stayOnPage) {
      resetPage();
    }
    setDirty(true);
    setShowingResults(true);
  }

  return (
      <div
          id="searchContainer"
          className="mx-auto flex h-full w-full grow flex-row content-stretch items-stretch self-stretch"
      >
        <SearchForm
            onSearch={handleNewSearch}
            facets={facets}
        />
        <SearchResultsColumn>
          {/* prevent flickering by adding isInit: */}
          {!isShowingResults && isInit &&
              <projectConfig.components.SearchInfoPage/>
          }
          {isShowingResults &&
              <SearchResults
                  onSearch={handleNewSearch}
                  facets={facets}
              />
          }
        </SearchResultsColumn>
      </div>
  );
}

async function getFacets(
    projectConfig: ProjectConfig,
) {
  const searchResults = await sendSearchQuery(projectConfig, {} as SearchUrlParams, {});
  if (!searchResults) {
    throw new Error('No facets found');
  }
  return searchResults.aggs;
}

