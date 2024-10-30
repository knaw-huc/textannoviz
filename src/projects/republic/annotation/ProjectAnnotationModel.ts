import {
  AnnoRepoBody,
  AnnoRepoBodyBase,
} from "../../../model/AnnoRepoAnnotation.ts";
import _ from "lodash";

export const projectEntityTypes = ["Entity", "DateOccurrence"];

export type ProjectEntityBody = EntityBody | DateEntityBody;

export type DateEntityBody = AnnoRepoBodyBase & {
  type: "DateOccurrence";
  text: string;
  metadata: {
    date: string;
  };
};

type EntityBody = AnnoRepoBodyBase & {
  type: "Entity";
  text: string;
  metadata: {
    category: string;
    entityID: string;
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

/**
 * Entity of type entity :)
 * (See also {@link isDateEntity})
 */
export const isEntityEntity = (
  toTest: AnnoRepoBodyBase,
): toTest is EntityBody => {
  return toTest.type === "Entity";
};

export const isDateEntity = (
  toTest: AnnoRepoBodyBase,
): toTest is DateEntityBody => {
  return toTest.type === "DateOccurrence";
};

export function getAnnotationCategory(annoRepoBody: AnnoRepoBody) {
  if (annoRepoBody.type === "DateOccurrence") {
    return "DAT";
  }
  return _.get(annoRepoBody, "metadata.category") ?? "unknown";
}

/**
 * Date has its own annotation and facet conversion
 */
export const entityCategoryToFacetName: Record<string, string> = {
  COM: "commissionId",
  HOE: "roleId",
  LOC: "locationId",
  ORG: "organisationId",
  PER: "personId",
};
