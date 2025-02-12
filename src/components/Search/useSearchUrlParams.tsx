import { useEffect, useState } from "react";
import { SearchParams, SearchQuery } from "../../model/Search.ts";
import {
  projectConfigSelector,
  useProjectStore,
} from "../../stores/project.ts";
import {
  cleanUrlParams,
  encodeSearchQuery,
  getSearchParamsFromUrl,
  getSearchQueryFromUrl,
  getUrlParams,
  pushUrlParamsToHistory,
  removeDefaultQuery,
} from "../../utils/UrlParamUtils.ts";
import { createSearchParams } from "./createSearchParams.tsx";
import { useSearchStore } from "../../stores/search/search-store.ts";
import { createSearchQuery } from "./createSearchQuery.tsx";

/**
 * The url is our single source of truth.
 * To keep the search params and query in sync with the url:
 * 1. update url with {@link updateSearchQuery}
 * 2. update search query and params with a useEffect
 */
export function useSearchUrlParams() {
  const { defaultQuery, isInitDefaultQuery } = useSearchStore();

  const projectConfig = useProjectStore(projectConfigSelector);

  const urlParams = getUrlParams();

  const [searchQuery, setSearchQuery] = useState<SearchQuery>(
    getSearchQueryFromUrl(createSearchQuery({ projectConfig }), urlParams),
  );
  const [searchParams, setSearchParams] = useState<SearchParams>(
    getSearchParamsFromUrl(createSearchParams({ projectConfig }), urlParams),
  );
  const [isInitSearchUrlParams, setInitSearchUrlParams] = useState(false);

  /**
   * Update search params and query when url changes
   */
  useEffect(() => {
    const urlParams = getUrlParams();
    setSearchParams(getSearchParamsFromUrl(searchParams, urlParams));
    setSearchQuery(getSearchQueryFromUrl(searchQuery, urlParams));
  }, [window.location.search]);

  useEffect(() => {
    if (!isInitDefaultQuery) {
      return;
    }
    setSearchQuery(getSearchQueryFromUrl(defaultQuery, urlParams));
    setInitSearchUrlParams(true);
  }, [isInitDefaultQuery]);

  /**
   * Update search query by updating the url, see useEffect
   */
  function updateSearchQuery(update: Partial<SearchQuery>): void {
    if (!isInitDefaultQuery) {
      throw new Error("Cannot update before init");
    }
    const merged = { ...searchQuery, ...update };
    const deduplicated = removeDefaultQuery(merged, defaultQuery);
    const encoded = encodeSearchQuery(deduplicated);
    pushUrlParamsToHistory({ query: encoded });
  }

  /**
   * Update search params by updating the url, see useEffect
   */
  function updateSearchParams(update: Partial<SearchParams>): void {
    pushUrlParamsToHistory(cleanUrlParams({ ...searchParams, ...update }));
  }

  return {
    isInitSearchUrlParams,
    searchQuery,
    updateSearchQuery,
    searchParams,
    updateSearchParams,
  };
}
