import { ProjectConfig } from "../../../model/ProjectConfig";
import {
  SearchQuery,
  toRequestBody,
} from "../../../stores/search/search-query-slice";
import { sendSearchQuery } from "../../../utils/broccoli";

export async function getFacets(
  projectConfig: ProjectConfig,
  aggregations: {
    facetName: string;
    order: string;
    size: number;
  }[],
  searchQuery: SearchQuery,
  signal: AbortSignal,
) {
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
