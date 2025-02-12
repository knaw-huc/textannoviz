import { SearchParams, SearchQuery } from "../../model/Search.ts";
import { useSearchUrlParams } from "./useSearchUrlParams.tsx";
import { useEffect } from "react";
import { handleAbort } from "../../utils/handleAbort.tsx";
import { useSearchStore } from "../../stores/search/search-store.ts";
import { isSearchableQuery } from "./isSearchableQuery.ts";
import { useSearchResults } from "./useSearchResults.tsx";
import _ from "lodash";
import {
  projectConfigSelector,
  useProjectStore,
} from "../../stores/project.ts";
import { defaultSearchParams } from "./createSearchParams.tsx";
import { useInitDefaultQuery } from "./useInitDefaultQuery.ts";

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
  const { searchQuery, updateSearchQuery, searchParams, updateSearchParams } =
    useSearchUrlParams();

  useInitDefaultQuery();

  useEffect(() => {
    if (isInitSearch || isLoadingSearch || !isInitDefaultQuery) {
      return;
    }

    const aborter = new AbortController();
    initSearch(aborter).catch(handleAbort);

    return () => {
      aborter.abort();
      setSearchInitStatus({ isLoadingSearch: false });
    };
  }, [isInitSearch, isInitDefaultQuery]);

  async function initSearch(aborter: AbortController) {
    setSearchInitStatus({ isLoadingSearch: true });

    const newSearchParams: SearchParams = _.merge(
      {},
      defaultSearchParams,
      searchParams,
    );
    updateSearchParams(newSearchParams);

    const newSearchQuery: SearchQuery = _.merge({}, defaultQuery, searchQuery);
    updateSearchQuery(newSearchQuery);

    if (
      projectConfig.showSearchResultsOnInfoPage ||
      isSearchableQuery(newSearchQuery, defaultQuery)
    ) {
      const searchResults = await getSearchResults(
        searchFacetTypes,
        searchParams,
        newSearchQuery,
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
