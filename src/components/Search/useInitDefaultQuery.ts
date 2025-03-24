import { useEffect } from "react";
import { toast } from "react-toastify";

import {
  projectConfigSelector,
  translateSelector,
  useProjectStore,
} from "../../stores/project.ts";
import { filterFacetsByType } from "../../stores/search/filterFacetsByType.ts";
import {
  defaultQuerySettersSelector,
  useSearchStore,
} from "../../stores/search/search-store.ts";
import { getElasticIndices } from "../../utils/broccoli.ts";
import { handleAbort } from "../../utils/handleAbort.tsx";
import { createSearchQuery } from "./createSearchQuery.tsx";
import { createAggs } from "./util/createAggs.ts";
import { getFacets } from "./util/getFacets.ts";

/**
 * The default query used when pressing enter in the full text input field
 * This includes facets that first need to be fetched from ES
 * and related properties (see {@link createSearchQuery})
 */
export function useInitDefaultQuery() {
  const projectConfig = useProjectStore(projectConfigSelector);
  const translate = useProjectStore(translateSelector);
  const { setDefaultQueryState, isInitDefaultQuery, isLoadingDefaultQuery } =
    useSearchStore();

  const { setKeywordFacets, setSearchFacetTypes } = useSearchStore(
    defaultQuerySettersSelector,
  );

  useEffect(() => {
    if (isInitDefaultQuery || isLoadingDefaultQuery) {
      return;
    }

    setDefaultQueryState({ isLoadingDefaultQuery: true });
    const aborter = new AbortController();
    init(aborter).catch(handleAbort);

    return () => {
      aborter.abort();
    };

    async function init(aborter: AbortController) {
      const newIndices = await getElasticIndices(projectConfig, aborter.signal);
      if (!newIndices) {
        return toast(translate("NO_INDICES_FOUND"), { type: "error" });
      }

      const newFacetTypes = newIndices[projectConfig.elasticIndexName];

      const newAggs = createAggs(newFacetTypes, projectConfig);

      const projectConfigQuery = createSearchQuery({ projectConfig });

      const newFacets = await getFacets(
        projectConfig,
        newAggs,
        projectConfigQuery,
        aborter.signal,
      );

      const newKeywordFacets = filterFacetsByType(
        newFacetTypes,
        newFacets,
        "keyword",
      );

      const newDateFacets = filterFacetsByType(
        newFacetTypes,
        newFacets,
        "date",
      );

      const newDefaultQuery = createSearchQuery({
        projectConfig,
        aggs: newAggs,
        dateFacets: newDateFacets,
      });

      setSearchFacetTypes(newFacetTypes);
      setKeywordFacets(newKeywordFacets);

      setDefaultQueryState({
        defaultQuery: newDefaultQuery,
        isLoadingDefaultQuery: false,
        isInitDefaultQuery: true,
      });
    }
  }, []);

  return;
}
