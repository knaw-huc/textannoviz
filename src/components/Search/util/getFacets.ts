import { ProjectConfig } from "../../../model/ProjectConfig";
import { FacetNamesByType } from "../../../model/Search";
import {
  SearchQuery,
  toRequestBody,
} from "../../../stores/search/search-query-slice";
import { sendSearchQuery } from "../../../utils/broccoli";

export async function getFacets(
  projectConfig: ProjectConfig,
  facetsByType: FacetNamesByType,
  searchQuery: SearchQuery,
  signal: AbortSignal,
) {
  const aggregations = Object.keys(facetsByType).map((agg) => {
    const newAgg = {
      facetName: agg,
      order: "countDesc",
      size: 10,
    };

    const override = projectConfig.overrideDefaultAggs.find(
      (override) => override.facetName === agg,
    );

    if (override) {
      Object.assign(newAgg, {
        order: override.order,
        size: override.size,
      });
    }

    return newAgg;
  });

  const query = {
    ...searchQuery,
    aggs: aggregations,
    terms: {},
  };

  const searchResults = await sendSearchQuery(
    projectConfig,
    { size: 0, indexName: projectConfig.elasticIndexName },
    toRequestBody(query),
    signal,
  );
  if (!searchResults?.aggs) {
    throw new Error("No facet request result");
  }
  return searchResults.aggs;
}
