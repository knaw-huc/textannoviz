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
import { useSearchParams } from "react-router-dom";

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
  const [sp, ssp] = useSearchParams();
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
    console.log("sp", sp);
    const urlParams = getUrlParams();
    setSearchParams(getSearchParamsFromUrl(defaultSearchParams, urlParams));
    setSearchQuery(getSearchQueryFromUrl(defaultQuery, urlParams));
  }, [sp]);

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
    pushUrlParamsToHistory({ ...historyUpdate, setter: ssp });
  }

  /**
   * Update search params by updating the url, see useEffect
   */
  function updateSearchParams(update: Partial<SearchParams>): void {
    const merged = { ...searchParams, ...update };
    const deduplicated = markDefaultParamProps(merged, defaultSearchParams);
    pushUrlParamsToHistory({ ...deduplicated, setter: ssp });
  }

  return {
    isInitSearchUrlParams,

    searchQuery,
    updateSearchQuery,

    searchParams,
    updateSearchParams,
  };
}
