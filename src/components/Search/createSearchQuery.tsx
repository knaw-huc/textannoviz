import { ProjectConfig } from "../../model/ProjectConfig.ts";
import { FacetEntry, NamedFacetAgg } from "../../model/Search.ts";
import { blankSearchQuery } from "./useSearchUrlParams.tsx";
import _ from "lodash";

export function createSearchQuery(props: {
  projectConfig: ProjectConfig;
  aggs?: NamedFacetAgg[];
  dateFacets?: FacetEntry[];
}) {
  const { projectConfig, aggs, dateFacets } = props;

  const configuredSearchQuery = {
    ...blankSearchQuery,
    dateFrom: projectConfig.initialDateFrom,
    dateTo: projectConfig.initialDateTo,
    rangeFrom: projectConfig.initialRangeFrom,
    rangeTo: projectConfig.initialRangeTo,
    aggs,
  };
  if (!_.isEmpty(dateFacets)) {
    configuredSearchQuery.dateFacet = dateFacets?.[0]?.[0];
  }
  if (projectConfig.showSliderFacets) {
    configuredSearchQuery.rangeFacet = "text.tokenCount";
  }
  return configuredSearchQuery;
}
