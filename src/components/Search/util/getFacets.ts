import { ProjectConfig } from "../../../model/ProjectConfig";
import { FacetNamesByType } from "../../../model/Search";
import { sendSearchQuery } from "../../../utils/broccoli";

export async function getFacets(
  projectConfig: ProjectConfig,
  facetsByType: FacetNamesByType,
  signal: AbortSignal,
) {
  console.log(facetsByType);
  // const DEFAULT_ES_AGGS_SIZE = 50;
  // const invNrSize = 1000;
  // const otherDefaults = ["invNr"];

  // const keywordAggs = Object.entries(facetsByType)
  //   .filter(([, facetType]) => facetType === "keyword")
  //   .map(([facetName]) => {
  //     const size = otherDefaults.includes(facetName)
  //       ? invNrSize
  //       : DEFAULT_ES_AGGS_SIZE;
  //     return `${facetName}:${size}`;
  //   });

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
