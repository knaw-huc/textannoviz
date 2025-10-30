import { useEffect } from "react";
import { handleAbort } from "../../utils/handleAbort.tsx";
import { useSearchStore } from "../../stores/search/search-store.ts";
import { isSearchableQuery } from "./isSearchableQuery.ts";
import { useSearchResults } from "./useSearchResults.tsx";
import { useInitDefaultQuery } from "./useInitDefaultQuery.ts";
import { useUrlSearchParamsStore } from "./useSearchUrlParamsStore.ts";
import { useInitSearchUrlParams } from "./useInitSearchUrlParams.tsx";
import { useIsDefaultQuery } from "./useIsDefaultQuery.ts";

export type UseInitSearchProps = {
  /**
   * When no query is provided, should results be fetched with the default query?
   */
  loadDefaultResults: boolean;
};

/**
 * Initialize search query, facets and (optional) results
 * - set default config values
 * - fetch keyword and date facets
 * - fetch results when {@link isSearchableQuery}
 */
export function useInitSearch(props: UseInitSearchProps) {
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
  const { isDefaultQuery } = useIsDefaultQuery();

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
      (props.loadDefaultResults && isDefaultQuery) ||
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
