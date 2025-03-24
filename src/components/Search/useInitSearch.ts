import { useEffect } from "react";

import {
  projectConfigSelector,
  useProjectStore,
} from "../../stores/project.ts";
import { useSearchStore } from "../../stores/search/search-store.ts";
import { handleAbort } from "../../utils/handleAbort.tsx";
import { isSearchableQuery } from "./isSearchableQuery.ts";
import { useInitDefaultQuery } from "./useInitDefaultQuery.ts";
import { useInitSearchUrlParams } from "./useInitSearchUrlParams.tsx";
import { useSearchResults } from "./useSearchResults.tsx";
import { useUrlSearchParamsStore } from "./useSearchUrlParamsStore.ts";

/**
 * Initialize search query, facets and (optional) results
 * - set default config values
 * - fetch keyword and date facets
 * - fetch results when {@link isSearchableQuery}
 */
export function useInitSearch() {
  const projectConfig = useProjectStore(projectConfigSelector);

  const {
    setSearchResults,
    setKeywordFacets,
    searchFacetTypes,
    defaultQuery,
    isInitDefaultQuery,
    isInitSearch,
    isLoadingSearch,
    setSearchInitStatus,
  } = useSearchStore();

  const { getSearchResults } = useSearchResults();
  const { searchQuery, isInitSearchUrlParams, searchParams } =
    useUrlSearchParamsStore();

  useInitDefaultQuery();
  useInitSearchUrlParams();

  useEffect(() => {
    if (
      isInitSearch ||
      isLoadingSearch ||
      !isInitDefaultQuery ||
      !isInitSearchUrlParams
    ) {
      return;
    }

    const aborter = new AbortController();
    initSearch(aborter).catch(handleAbort);

    return () => {
      aborter.abort();
      setSearchInitStatus({ isLoadingSearch: false });
    };
  }, [isInitSearch, isInitDefaultQuery, isInitSearchUrlParams]);

  async function initSearch(aborter: AbortController) {
    setSearchInitStatus({ isLoadingSearch: true });

    if (
      projectConfig.showSearchResultsOnInfoPage ||
      isSearchableQuery(searchQuery, defaultQuery)
    ) {
      const searchResults = await getSearchResults(
        searchFacetTypes,
        searchParams,
        searchQuery,
        aborter.signal,
      );
      if (searchResults) {
        setSearchResults(searchResults.results);
        setKeywordFacets(searchResults.facets);
      }
    }

    setSearchInitStatus({
      isLoadingSearch: false,
      isInitSearch: true,
    });
  }

  return;
}
