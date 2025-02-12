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
  removeDefaultProps,
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

  const [isInitSearchUrlParams, setInitSearchUrlParams] = useState(false);

  const [searchParams, setSearchParams] = useState<SearchParams>(
    getSearchParamsFromUrl(createSearchParams({ projectConfig }), urlParams),
  );

  /**
   * Initialize search query after default query is initialized
   */
  const [searchQuery, setSearchQuery] = useState<SearchQuery>(
    getSearchQueryFromUrl(createSearchQuery({ projectConfig }), urlParams),
  );
  useEffect(() => {
    if (!isInitDefaultQuery) {
      return;
    }
    setSearchQuery(getSearchQueryFromUrl(defaultQuery, urlParams));
    setInitSearchUrlParams(true);
  }, [isInitDefaultQuery]);

  /**
   * Update search params and query when url changes
   */
  useEffect(() => {
    const urlParams = getUrlParams();
    setSearchParams(getSearchParamsFromUrl(searchParams, urlParams));
    setSearchQuery(getSearchQueryFromUrl(searchQuery, urlParams));
  }, [window.location.search]);

  /**
   * Update search query by updating the url, see useEffect
   */
  function updateSearchQuery(update: Partial<SearchQuery>): void {
    if (!isInitDefaultQuery) {
      throw new Error("Cannot update before init");
    }
    const merged = { ...searchQuery, ...update };
    const deduplicated = removeDefaultProps(merged, defaultQuery);
    const encoded = encodeSearchQuery(deduplicated);
    pushUrlParamsToHistory({ query: encoded });
  }

  /**
   * Update search params by updating the url, see useEffect
   */
  function updateSearchParams(update: Partial<SearchParams>): void {
    const merged = { ...searchParams, ...update };
    const deduplicated = removeDefaultProps(merged, searchParams);
    const cleaned = cleanUrlParams(deduplicated);
    pushUrlParamsToHistory(cleaned);
  }

  return {
    isInitSearchUrlParams,
    searchQuery,
    updateSearchQuery,
    searchParams,
    updateSearchParams,
  };
}
