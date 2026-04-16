import { useEffect } from "react";
import { handleAbort } from "../../utils/handleAbort.tsx";
import { useSearchStore } from "../../stores/search/search-store.ts";
import { isSearchableQuery } from "./isSearchableQuery.ts";
import { useSearchResults } from "./useSearchResults.tsx";
import {
  projectConfigSelector,
  useProjectStore,
} from "../../stores/project.ts";
import { useInitDefaultQuery } from "./useInitDefaultQuery.ts";
import { useUrlSearchParamsStore } from "./useSearchUrlParamsStore.ts";
import { useInitSearchUrlParams } from "./useInitSearchUrlParams.tsx";

/**
 * Initialize search query, facets and (optional) results
 * - set default config values
 * - fetch keyword and date facets
 * - fetch results when {@link isSearchableQuery}
 */
export function useInitSearch() {
  const projectConfig = useProjectStore(projectConfigSelector);

  const setSearchResults = useSearchStore((state) => state.setSearchResults);
  const setKeywordFacets = useSearchStore((state) => state.setKeywordFacets);
  const searchFacetTypes = useSearchStore((state) => state.searchFacetTypes);
  const defaultQuery = useSearchStore((state) => state.defaultQuery);
  const isInitDefaultQuery = useSearchStore(
    (state) => state.isInitDefaultQuery,
  );
  const isInitSearch = useSearchStore((state) => state.isInitSearch);
  const isLoadingSearch = useSearchStore((state) => state.isLoadingSearch);
  const setSearchInitStatus = useSearchStore(
    (state) => state.setSearchInitStatus,
  );

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
