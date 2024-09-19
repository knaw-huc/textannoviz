import { ProjectConfig } from "../../../model/ProjectConfig";
import {
  Aggregations,
  FacetTypes,
  NestedAggregation,
} from "../../../model/Search";

export function createAggs(
  facetTypes: FacetTypes,
  projectConfig: ProjectConfig,
) {
  return Object.entries(facetTypes).reduce((newAggs, [key, values]) => {
    let aggs: Aggregations = {};

    if (typeof values === "string") {
      aggs = {
        [key]: {
          order: "countDesc",
          size: 10,
        },
      };
    } else if (
      typeof values === "object" &&
      projectConfig.nestedFacets.includes(key)
    ) {
      const nestedFacetValues = Object.keys(values).reduce((acc, value) => {
        acc[value] = {
          order: "countDesc",
          size: 10,
        };
        return acc;
      }, {} as NestedAggregation);
      aggs = {
        [key]: nestedFacetValues,
      };
    }

    if (aggs[key]) {
      const override = projectConfig.overrideDefaultAggs.find(
        (override) => override.facetName === key,
      );

      if (override) {
        Object.assign(aggs[key], {
          order: override.order,
          size: override.size,
        });
      }

      newAggs = {
        ...newAggs,
        ...aggs,
      };
    }

    return newAggs;
  }, {} as Aggregations);
}
