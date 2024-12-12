import { useEffect, useState } from "react";
import { getElasticIndices } from "../../utils/broccoli.ts";
import { toast } from "react-toastify";
import { createAggs } from "./util/createAggs.ts";
import { getFacets } from "./util/getFacets.ts";
import { filterFacetsByType } from "../../stores/search/filterFacetsByType.ts";
import { createSearchQuery } from "./createSearchQuery.tsx";
import {
  projectConfigSelector,
  translateSelector,
  useProjectStore,
} from "../../stores/project.ts";
import {
  defaultQuerySettersSelector,
  useSearchStore,
} from "../../stores/search/search-store.ts";
import { handleAbort } from "../../utils/handleAbort.tsx";

export function useDefaultQuery() {
  const projectConfig = useProjectStore(projectConfigSelector);
  const translate = useProjectStore(translateSelector);

  const [isInit, setIsInit] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const { setKeywordFacets, setSearchFacetTypes, setDefaultQuery } =
    useSearchStore(defaultQuerySettersSelector);

  useEffect(() => {
    if (isInit || isLoading) {
      return;
    }

    setLoading(true);
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

      const blankQuery = createSearchQuery({ projectConfig });

      const newFacets = await getFacets(
        projectConfig,
        newAggs,
        blankQuery,
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
      setDefaultQuery(newDefaultQuery);
      setKeywordFacets(newKeywordFacets);

      setLoading(false);
      setIsInit(true);
    }
  }, []);

  return {
    isInitDefaultQuery: isInit,
  };
}
