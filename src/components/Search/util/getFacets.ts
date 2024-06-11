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
    let newAgg = {
      facetName: agg,
      order: "countDesc",
      size: 10,
    };

    projectConfig.overrideDefaultAggs?.map((override) => {
      if (override.facetName === agg) {
        newAgg = {
          facetName: override.facetName,
          order: override.order,
          size: override.size,
        };
      }
    });

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
