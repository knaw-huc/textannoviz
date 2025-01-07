import { ProjectConfig } from "../../../model/ProjectConfig";
import { sendSearchQuery } from "../../../utils/broccoli";
import { toRequestBody } from "../../../stores/search/toRequestBody.ts";
import { SearchQuery } from "../../../model/Search.ts";

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
