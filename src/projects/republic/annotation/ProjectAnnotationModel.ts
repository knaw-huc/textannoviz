import {
  AnnoRepoBody,
  AnnoRepoBodyBase,
} from "../../../model/AnnoRepoAnnotation.ts";
import _ from "lodash";

export const projectEntityTypes = ["Entity", "DateOccurrence"];

type ProjectDateEntityBody = AnnoRepoBodyBase & {
  type: "DateOccurrence";
  text: string;
  metadata: {
    date: string;
  };
};

export type ProjectEntityBody =
  | (AnnoRepoBodyBase & {
      type: "Entity";
      text: string;
      metadata: {
        entityId: string;
        entityLabels: string[];
        inventoryNum: string;
        name: string;
      };
    })
  | ProjectDateEntityBody;

export const isEntity = (
  toTest: AnnoRepoBodyBase,
): toTest is ProjectEntityBody => {
  return projectEntityTypes.includes(toTest.type);
};

export const isDateEntity = (
  toTest: AnnoRepoBodyBase,
): toTest is ProjectDateEntityBody => {
  return toTest.type === "DateOccurrence";
};

export function getEntityCategory(annoRepoBody: AnnoRepoBody) {
  if (annoRepoBody.type === "DateOccurrence") {
    return "DAT";
  }
  return _.get(annoRepoBody, "metadata.category") ?? "unknown";
}
