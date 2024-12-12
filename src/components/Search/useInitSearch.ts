import { getElasticIndices } from "../../utils/broccoli.ts";
import { toast } from "react-toastify";
import { getFacets } from "./util/getFacets.ts";
import { filterFacetsByType } from "../../stores/search/filterFacetsByType.ts";
import { SearchQuery } from "../../model/Search.ts";
import { useSearchUrlParams } from "./useSearchUrlParams.tsx";
import { useEffect, useState } from "react";
import {
  projectConfigSelector,
  translateSelector,
  useProjectStore,
} from "../../stores/project.ts";
import { handleAbort } from "../../utils/handleAbort.tsx";
import { useSearchStore } from "../../stores/search/search-store.ts";
import { isSearchableQuery } from "./isSearchableQuery.ts";
import { useSearchResults } from "./useSearchResults.tsx";
import { createAggs } from "./util/createAggs.ts";
import { createSearchQuery } from "./createSearchQuery.tsx";

/**
 * Initialize search query, facets and (optional) results
 * - set default config values
 * - fetch keyword and date facets
 * - fetch results when {@link isSearchableQuery}
 */
export function useInitSearch() {
  const projectConfig = useProjectStore(projectConfigSelector);
  const translate = useProjectStore(translateSelector);

  const { setSearchResults, setKeywordFacets, setSearchFacetTypes } =
    useSearchStore();
  const { searchParams } = useSearchUrlParams();
  const { getSearchResults } = useSearchResults();
  const { searchQuery, updateSearchQuery } = useSearchUrlParams();

  const [isInitSearch, setIsInitSearch] = useState(false);
  const [isLoadingSearch, setLoading] = useState(false);
  const [defaultQuery, setDefaultQuery] = useState<Partial<SearchQuery>>();

  useEffect(() => {
    if (isInitSearch || isLoadingSearch) {
      return;
    }

    const aborter = new AbortController();
    initSearch(aborter).catch(handleAbort);

    return () => {
      aborter.abort();
      setLoading(false);
    };
  }, [isInitSearch]);

  async function initSearch(aborter: AbortController) {
    setLoading(true);
    const newIndices = await getElasticIndices(projectConfig, aborter.signal);
    if (!newIndices) {
      return toast(translate("NO_INDICES_FOUND"), { type: "error" });
    }

    const newFacetTypes = newIndices[projectConfig.elasticIndexName];

    const newAggs = createAggs(newFacetTypes, projectConfig, searchQuery.aggs);

    const newFacets = await getFacets(
      projectConfig,
      newAggs,
      searchQuery,
      aborter.signal,
    );

    const newKeywordFacets = filterFacetsByType(
      newFacetTypes,
      newFacets,
      "keyword",
    );

    const newDateFacets = filterFacetsByType(newFacetTypes, newFacets, "date");

    const newDefaultQuery = createSearchQuery({
      projectConfig,
      aggs: newAggs,
      dateFacets: newDateFacets,
    });

    const newSearchQuery: SearchQuery = {
      ...newDefaultQuery,
      ...searchQuery,
      aggs: newAggs,
    };

    setDefaultQuery(newDefaultQuery);
    setKeywordFacets(newKeywordFacets);
    setSearchFacetTypes(newFacetTypes);
    updateSearchQuery(newSearchQuery);

    if (isSearchableQuery(newSearchQuery, newDefaultQuery)) {
      const searchResults = await getSearchResults(
        newFacetTypes,
        searchParams,
        newSearchQuery,
        aborter.signal,
      );
      if (searchResults) {
        setSearchResults(searchResults.results);
        setKeywordFacets(searchResults.facets);
      }
    }

    setLoading(false);
    setIsInitSearch(true);
  }

  return {
    defaultQuery,
    isInitSearch,
    isLoadingSearch,
  };
}
