import { ProjectConfig } from "../../../model/ProjectConfig";
import { SearchQuery, Terms } from "../../../model/Search.ts";
import { toRequestBody } from "../../../stores/search/toRequestBody.ts";
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
  terms?: Terms,
) {
  const query = {
    ...searchQuery,
    aggs: aggregations,
    terms: terms || {},
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
