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

  const [prevSearchParams, setPrevSearchParams] = useState<string>(
    window.location.search,
  );

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
    const newSearchParams = window.location.search;
    if (newSearchParams === prevSearchParams) {
      return;
    }
    setPrevSearchParams(newSearchParams);

    const urlParams = getUrlParams();
    // TODO; what should the template be?
    const newStateParams = getSearchParamsFromUrl(defaultSearchParams, urlParams);
    setSearchParams(newStateParams);
    // TODO; and what should the template be for query?
    setSearchQuery(getSearchQueryFromUrl(defaultQuery, urlParams));
    console.log("window.location.search", {
      urlSize: new URLSearchParams(newSearchParams).get("size"),
      stateSize: newStateParams.size,
      prevSearchParams,
      newSearchParams,
      prevStateSearchParams: searchParams,
      nextStateSearchParams: newStateParams,
    });
  }, [searchParams, urlParams, window.location.search]);

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
    const deduplicated = markDefaultParamProps(merged, defaultSearchParams);
    console.log("updateSearchParams", { update, deduplicated });
    pushUrlParamsToHistory(deduplicated);
  }

  return {
    isInitSearchUrlParams,

    searchQuery,
    updateSearchQuery,

    searchParams,
    updateSearchParams,
  };
}
