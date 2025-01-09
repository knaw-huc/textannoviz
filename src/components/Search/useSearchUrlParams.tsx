import { useEffect, useState } from "react";
import {
  cleanUrlParams,
  encodeSearchQuery,
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
  const { defaultQuery } = useSearchStore();
  const projectConfig = useProjectStore(projectConfigSelector);

  const [searchQuery, setSearchQuery] = useState<SearchQuery>(
    getSearchQueryFromUrl(
      createSearchQuery({ projectConfig }),
      getUrlSearchParams(),
    ),
  );

  const [searchParams, setSearchParams] = useState<SearchParams>(
    getSearchParamsFromUrl(
      createSearchParams({ projectConfig }),
      getUrlSearchParams(),
    ),
  );

  /**
   * Add params to url when default query has been initialized
   */
  useEffect(() => {
    getSearchQueryFromUrl(defaultQuery, getUrlSearchParams());
  }, [defaultQuery]);

  /**
   * Update search params and query when url changes
   */
  useEffect(() => {
    setSearchParams(getSearchParamsFromUrl(searchParams, getUrlSearchParams()));
    const searchQueryFromUrl = getSearchQueryFromUrl(
      searchQuery,
      getUrlSearchParams(),
    );
    setSearchQuery(searchQueryFromUrl);
  }, [window.location.search]);

  /**
   * Update search params and query by updating the url
   */
  function updateSearchQuery(update: Partial<SearchQuery>): void {
    setUrlParams({ query: encodeSearchQuery({ ...searchQuery, ...update }) });
  }

  function updateSearchParams(update: Partial<SearchParams>): void {
    setUrlParams(cleanUrlParams({ ...searchParams, ...update }));
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

function getUrlSearchParams() {
  return new URLSearchParams(window.location.search);
}

function setUrlParams(toUpdate: Record<string, string>) {
  const updatedUrl = new URL(window.location.toString());
  for (const key in toUpdate) {
    updatedUrl.searchParams.set(key, toUpdate[key]);
  }
  history.pushState(null, "", updatedUrl);
}
