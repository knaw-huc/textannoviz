import { ProjectConfig } from "../../model/ProjectConfig.ts";
import { NamedFacetAgg, SearchQuery } from "../../model/Search.ts";
import { blankSearchQuery } from "../../stores/search/default-query-slice.ts";

export function createSearchQuery(props: {
  projectConfig: ProjectConfig;
  aggs?: NamedFacetAgg[];
  dateFacet?: string;
}): SearchQuery {
  const { projectConfig, aggs, dateFacet } = props;

  const configuredSearchQuery = {
    ...blankSearchQuery,
    dateFrom: projectConfig.initialDateFrom,
    dateTo: projectConfig.initialDateTo,
    rangeFrom: projectConfig.initialRangeFrom,
    rangeTo: projectConfig.initialRangeTo,
    searchInTextView: projectConfig.viewsToSearchIn,
    aggs,
  };
  if (dateFacet?.length) {
    configuredSearchQuery.dateFacet = dateFacet;
  }
  if (projectConfig.showSliderFacets) {
    configuredSearchQuery.rangeFacet = "text.tokenCount";
  }
  return configuredSearchQuery;
}
