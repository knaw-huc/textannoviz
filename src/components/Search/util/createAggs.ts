import { ProjectConfig } from "../../../model/ProjectConfig.ts";
import { FacetTypes, NamedFacetAgg } from "../../../model/Search.ts";
import { createDefaultAggs } from "./createDefaultAggs.ts";
import merge from "lodash/merge";

export function createAggs(
  newFacetTypes: FacetTypes,
  projectConfig: ProjectConfig,
  urlAggs?: NamedFacetAgg[],
): NamedFacetAgg[] {
  const defaultAggs = createDefaultAggs(newFacetTypes, projectConfig);
  return merge([], defaultAggs, urlAggs);
}
