import { ProjectConfig } from "../../../model/ProjectConfig";
import { FacetTypes, NamedFacetAgg } from "../../../model/Search";

export function createDefaultAggs(
  facetTypes: FacetTypes,
  projectConfig: ProjectConfig,
): NamedFacetAgg[] {
  const defaultOrder = "countDesc";
  const defaultSize = 10;

  return Object.keys(facetTypes).map((agg) => {
    const newAgg = {
      facetName: agg,
      order: "countDesc",
      size: 10,
    };

    const override = projectConfig.overrideDefaultAggs.find(
      (override) => override.facetName === agg,
    );

    if (override) {
      Object.assign(newAgg, {
        order: override.order ?? defaultOrder,
        size: override.size ?? defaultSize,
      });
    }

    return newAgg;
  });
}
