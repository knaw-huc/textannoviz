import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  createUrlParams,
  getSearchParamsFromUrl,
  getSearchQueryFromUrl,
} from "../../utils/UrlParamUtils.ts";
import { SearchParams, SearchQuery } from "../../model/Search.ts";
import { useSearchStore } from "../../stores/search/search-store.ts";
import { createSearchQuery } from "./createSearchQuery.tsx";
import {
  projectConfigSelector,
  useProjectStore,
} from "../../stores/project.ts";
import { createSearchParams } from "./createSearchParams.tsx";

/**
 * The url is our single source of truth.
 * To keep the search params and query in sync with the url:
 * 1. update url with {@link updateSearchQuery}
 * 2. update search query and params with a useEffect
 */
export function useSearchUrlParams() {
  const [urlParams, setUrlParams] = useSearchParams();

  const { defaultQuery } = useSearchStore();
  const projectConfig = useProjectStore(projectConfigSelector);

  const [searchQuery, setSearchQuery] = useState<SearchQuery>(
    getSearchQueryFromUrl(createSearchQuery({ projectConfig }), urlParams),
  );

  const [searchParams, setSearchParams] = useState<SearchParams>(
    getSearchParamsFromUrl(createSearchParams({ projectConfig }), urlParams),
  );

  /**
   * Add params to url when default query has been initialized
   */
  useEffect(() => {
    getSearchQueryFromUrl(defaultQuery, urlParams);
  }, [defaultQuery]);

  /**
   * Update search params and query when url changes
   */
  useEffect(() => {
    setSearchParams(getSearchParamsFromUrl(searchParams, urlParams));
    const searchQueryFromUrl = getSearchQueryFromUrl(searchQuery, urlParams);
    console.log("useEffect fullText:", searchQueryFromUrl.fullText);
    setSearchQuery(searchQueryFromUrl);
  }, [urlParams]);

  /**
   * Update search params and query by updating the url
   */
  function updateSearchQuery(update: Partial<SearchQuery>): void {
    console.log("updateSearchQuery fullText:", update.fullText);
    updateUrl({ searchQuery: { ...searchQuery, ...update } });
  }
  function updateSearchParams(update: Partial<SearchParams>): void {
    console.log("updateSearchParams fullText:", searchQuery.fullText);
    updateUrl({ searchParams: { ...searchParams, ...update } });
  }

  function updateUrl(
    update: Partial<{
      searchQuery: SearchQuery;
      searchParams: SearchParams;
    }>,
  ) {
    const updatedUrlParams = createUrlParams(
      Object.fromEntries(urlParams.entries()),
      update.searchParams || searchParams,
      update.searchQuery || searchQuery,
    );
    if (
      new URLSearchParams(updatedUrlParams).toString() === urlParams.toString()
    ) {
      return;
    }
    setUrlParams(updatedUrlParams);
  }

  function toFirstPage() {
    updateSearchParams({ from: 0 });
  }

  return {
    searchQuery,
    updateSearchQuery,
    searchParams,
    updateSearchParams,
    toFirstPage,
  };
}
