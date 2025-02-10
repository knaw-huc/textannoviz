import { useEffect, useState } from "react";
import { SearchParams, SearchQuery } from "../../model/Search.ts";
import {
  projectConfigSelector,
  useProjectStore,
} from "../../stores/project.ts";
import {
  cleanUrlParams,
  deduplicateQuery,
  encodeSearchQuery,
  getSearchParamsFromUrl,
  getSearchQueryFromUrl,
  getUrlParams,
  pushUrlParamsToHistory,
} from "../../utils/UrlParamUtils.ts";
import { createSearchParams } from "./createSearchParams.tsx";
import { createSearchQuery } from "./createSearchQuery.tsx";
import { useSearchStore } from "../../stores/search/search-store.ts";

/**
 * The url is our single source of truth.
 * To keep the search params and query in sync with the url:
 * 1. update url with {@link updateSearchQuery}
 * 2. update search query and params with a useEffect
 */
export function useSearchUrlParams() {
  const projectConfig = useProjectStore(projectConfigSelector);

  const urlParams = getUrlParams();

  const [searchQuery, setSearchQuery] = useState<SearchQuery>(
    getSearchQueryFromUrl(createSearchQuery({ projectConfig }), urlParams),
  );

  const [searchParams, setSearchParams] = useState<SearchParams>(
    getSearchParamsFromUrl(createSearchParams({ projectConfig }), urlParams),
  );

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
    const merged = { ...searchQuery, ...update };
    const deduplicated = deduplicateQuery(merged, defaultQuery);
    const encoded = encodeSearchQuery(merged);
    console.log("updateSearchQuery", {
      update,
      defaultQuery,
      deduplicated,
      merged,
    });
    pushUrlParamsToHistory({
      query: encoded,
    });
  }

  /**
   * Update search params by updating the url, see useEffect
   */
  function updateSearchParams(update: Partial<SearchParams>): void {
    pushUrlParamsToHistory(cleanUrlParams({ ...searchParams, ...update }));
  }

  const { defaultQuery } = useSearchStore();

  return {
    searchQuery,
    updateSearchQuery,
    searchParams,
    updateSearchParams,
  };
}
