import { ProjectConfig } from "../../../model/ProjectConfig";
import { FacetNamesByType } from "../../../model/Search";

export function createAggs(
  index: FacetNamesByType,
  projectConfig: ProjectConfig,
) {
  return Object.keys(index).map((agg) => {
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
        order: override.order,
        size: override.size,
      });
    }

    return newAgg;
  });
}
