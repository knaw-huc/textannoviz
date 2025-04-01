import { useEffect } from "react";

import {
  projectConfigSelector,
  useProjectStore,
} from "../../stores/project.ts";
import { useSearchStore } from "../../stores/search/search-store.ts";
import { createSearchParams } from "./createSearchParams.tsx";
import { useUrlSearchParamsStore } from "./useSearchUrlParamsStore.ts";

/**
 * The url is our single source of truth.
 * To keep the search params and query in sync with the url:
 * 1. update url with {@link updateSearchQuery}
 * 2. update search query and params with a useEffect
 */
export function useInitSearchUrlParams() {
  const projectConfig = useProjectStore(projectConfigSelector);
  const { defaultQuery, isInitDefaultQuery } = useSearchStore();

  const {
    isInitSearchUrlParams,
    setDefaultSearchParams,
    setDefaultSearchQuery,
    initSearchUrlParams,
  } = useUrlSearchParamsStore();
  /**
   * Note: defaultQuery is persistent, hook state is not
   * - landing route: initialize query with useEffect
   * - switching route: initialize query with useState param
   */
  useEffect(() => {
    if (isInitDefaultQuery && !isInitSearchUrlParams) {
      setDefaultSearchQuery(defaultQuery);
      setDefaultSearchParams(createSearchParams({ projectConfig }));
      initSearchUrlParams();
    }
  }, [isInitDefaultQuery, isInitSearchUrlParams]);

  return;
}
