import { useEffect } from "react";
import {
  projectConfigSelector,
  useProjectStore,
} from "../../stores/project.ts";
import {
  getSearchQueryFromUrl,
  getUrlParams,
} from "../../utils/UrlParamUtils.ts";
import { createSearchParams } from "./createSearchParams.tsx";
import { useSearchStore } from "../../stores/search/search-store.ts";
import { useUrlSearchParamsStore } from "./useSearchUrlParamsStore.ts";

/**
 * The url is our single source of truth.
 * To keep the search params and query in sync with the url:
 * 1. update url with {@link updateSearchQuery}
 * 2. update search query and params with a useEffect
 */
export function useInitSearchUrlParams() {
  const urlParams = getUrlParams();
  const projectConfig = useProjectStore(projectConfigSelector);
  const { defaultQuery, isInitDefaultQuery } = useSearchStore();

  const {
    isInitSearchUrlParams,
    updateSearchQuery,
    updateSearchParams,
    setInitSearchUrlParams,
  } = useUrlSearchParamsStore();
  /**
   * Note: defaultQuery is persistent, hook state is not
   * - landing route: initialize query with useEffect
   * - switching route: initialize query with useState param
   */
  useEffect(() => {
    if (isInitDefaultQuery && !isInitSearchUrlParams) {
      console.log("useInitSearchUrlParams: init");
      updateSearchQuery(getSearchQueryFromUrl(defaultQuery, urlParams));
      updateSearchParams(createSearchParams({ projectConfig }));
      setInitSearchUrlParams(true);
    } else {
      console.log("useInitSearchUrlParams: no init");
    }
  }, [isInitDefaultQuery, isInitSearchUrlParams]);

  return;
}
