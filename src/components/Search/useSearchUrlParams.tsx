import { useEffect, useState } from "react";
import { SearchParams, SearchQuery } from "../../model/Search.ts";
import {
  projectConfigSelector,
  useProjectStore,
} from "../../stores/project.ts";
import {
  encodeSearchQuery,
  getSearchParamsFromUrl,
  getSearchQueryFromUrl,
  getUrlParams,
  markDefaultParamProps,
  pushUrlParamsToHistory,
  removeDefaultQueryProps,
} from "../../utils/UrlParamUtils.ts";
import { createSearchParams } from "./createSearchParams.tsx";
import { useSearchStore } from "../../stores/search/search-store.ts";
import _ from "lodash";

/**
 * The url is our single source of truth.
 * To keep the search params and query in sync with the url:
 * 1. update url with {@link updateSearchQuery}
 * 2. update search query and params with a useEffect
 */
export function useSearchUrlParams() {
  const urlParams = getUrlParams();
  const projectConfig = useProjectStore(projectConfigSelector);
  const { defaultQuery, isInitDefaultQuery } = useSearchStore();

  const [isInitSearchUrlParams, setInitSearchUrlParams] =
    useState(isInitDefaultQuery);

  const defaultSearchParams = createSearchParams({ projectConfig });
  const [searchParams, setSearchParams] = useState<SearchParams>(
    getSearchParamsFromUrl(defaultSearchParams, urlParams),
  );

  /**
   * Note: defaultQuery is persistent, hook state is not
   * - landing route: initialize query with useEffect
   * - switching route: initialize query with useState param
   */
  const [searchQuery, setSearchQuery] = useState<SearchQuery>(
    getSearchQueryFromUrl(defaultQuery, urlParams),
  );
  useEffect(() => {
    if (isInitDefaultQuery && !isInitSearchUrlParams) {
      setSearchQuery(getSearchQueryFromUrl(defaultQuery, urlParams));
      setInitSearchUrlParams(true);
    }
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
    const merged = { ...searchQuery, ...update };
    const deduplicated = removeDefaultQueryProps(merged, defaultQuery);
    const encoded = encodeSearchQuery(deduplicated);
    const historyUpdate = _.isEmpty(deduplicated)
      ? { toRemove: ["query"] }
      : { toUpdate: { query: encoded } };
    pushUrlParamsToHistory(historyUpdate);
  }

  /**
   * Update search params by updating the url, see useEffect
   */
  function updateSearchParams(update: Partial<SearchParams>): void {
    const merged = { ...searchParams, ...update };
    const removeDefaults = markDefaultParamProps(merged, defaultSearchParams);
    pushUrlParamsToHistory(removeDefaults);
  }

  return {
    isInitSearchUrlParams,

    searchQuery,
    updateSearchQuery,

    searchParams,
    updateSearchParams,
  };
}
