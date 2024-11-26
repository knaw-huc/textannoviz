import { getElasticIndices } from "../../utils/broccoli.ts";
import { toast } from "react-toastify";
import { createAggs } from "./util/createAggs.ts";
import { getFacets } from "./util/getFacets.ts";
import { filterFacetsByType } from "../../stores/search/filterFacetsByType.ts";
import { SearchQuery } from "../../model/Search.ts";
import _ from "lodash";
import { getDefaultQuery, useSearchUrlParams } from "./useSearchUrlParams.tsx";
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

  const [isInit, setInit] = useState(false);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (isInit || isLoading) {
      return;
    }

    const aborter = new AbortController();
    initSearch(aborter).catch(handleAbort);

    return () => {
      aborter.abort();
      setLoading(false);
    };
  }, [isInit]);

  async function initSearch(aborter: AbortController) {
    setLoading(true);
    const newIndices = await getElasticIndices(projectConfig, aborter.signal);
    if (!newIndices) {
      return toast(translate("NO_INDICES_FOUND"), { type: "error" });
    }

    const newFacetTypes = newIndices[projectConfig.elasticIndexName];
    const aggregations = createAggs(newFacetTypes, projectConfig);
    const newFacets = await getFacets(
      projectConfig,
      aggregations,
      searchQuery,
      aborter.signal,
    );

    const newDateFacets = filterFacetsByType(newFacetTypes, newFacets, "date");

    const newKeywordFacets = filterFacetsByType(
      newFacetTypes,
      newFacets,
      "keyword",
    );

    const newSearchQuery: SearchQuery = {
      ...searchQuery,
      aggs: aggregations,
    };

    if (!_.isEmpty(newDateFacets)) {
      newSearchQuery.dateFacet = newDateFacets?.[0]?.[0];
    }

    setKeywordFacets(newKeywordFacets);
    setSearchFacetTypes(newFacetTypes);
    updateSearchQuery(newSearchQuery);

    if (isSearchableQuery(newSearchQuery, getDefaultQuery(projectConfig))) {
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
    setInit(true);
  }

  return {
    isInit,
    isLoadingSearch: isLoading,
  };
}
