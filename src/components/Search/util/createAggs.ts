import { ProjectConfig } from "../../../model/ProjectConfig.ts";
import { FacetTypes, NamedFacetAgg } from "../../../model/Search.ts";
import { createDefaultAggs } from "./createDefaultAggs.ts";
import _ from "lodash";

export function createAggs(
  newFacetTypes: FacetTypes,
  projectConfig: ProjectConfig,
  urlAggs?: NamedFacetAgg[],
): NamedFacetAgg[] {
  const defaultAggs = createDefaultAggs(newFacetTypes, projectConfig);
  return _.merge([], defaultAggs, urlAggs);
}
