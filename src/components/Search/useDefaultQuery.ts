import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { NamedFacetAgg } from "../../model/Search.ts";
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

      //deze moet dan nog apart opgeslagen worden en gebruikt worden in de facetfilter in SearchForm.tsx. De 'allPossibleKeywordFacets' moet dan ook nog aangepast worden bij de FacetFilter.
      const newAggs = createAggs(newFacetTypes, projectConfig);

      console.log(projectConfig.defaultKeywordAggsToRender);

      const filteredAggs = newAggs
        .map((agg) => {
          if (
            projectConfig.defaultKeywordAggsToRender.includes(agg.facetName)
          ) {
            return agg;
          }
          return undefined;
        })
        .filter((agg): agg is NamedFacetAgg => agg !== undefined);

      console.log(filteredAggs);

      const projectConfigQuery = createSearchQuery({ projectConfig });

      const newFacets = await getFacets(
        projectConfig,
        filteredAggs,
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
        aggs: filteredAggs,
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
