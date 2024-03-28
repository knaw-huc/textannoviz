import { ProjectConfig } from "../../../model/ProjectConfig";
import { sendSearchQuery } from "../../../utils/broccoli";

export async function getFacets(
  projectConfig: ProjectConfig,
  signal: AbortSignal,
) {
  const searchResults = await sendSearchQuery(
    projectConfig,
    { size: 0, indexName: projectConfig.elasticIndexName },
    {},
    signal,
  );
  if (!searchResults?.aggs) {
    throw new Error("No facet request result");
  }
  return searchResults.aggs;
}
