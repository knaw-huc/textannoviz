import {
  AnnoRepoBody,
  AnnoRepoBodyBase,
} from "../../../model/AnnoRepoAnnotation.ts";
import _ from "lodash";

export const projectEntityTypes = ["Entity", "DateOccurrence"];

export type ProjectEntityBody = AnnoRepoBodyBase & {
  type: "Entity" | "DateOccurrence";
  text: string;
  metadata: {
    entityId: string;
    entityLabels: string[];
    inventoryNum: string;
    name: string;
  };
};

export const isEntity = (
  toTest: AnnoRepoBodyBase,
): toTest is ProjectEntityBody => {
  return projectEntityTypes.includes(toTest.type);
};

export function getAnnotationCategory(annoRepoBody: AnnoRepoBody) {
  if (annoRepoBody.type === "DateOccurrence") {
    return "DAT";
  }
  return _.get(annoRepoBody, "metadata.category") ?? "unknown";
}
