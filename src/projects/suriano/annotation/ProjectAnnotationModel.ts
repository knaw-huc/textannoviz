import {
  AnnoRepoBody,
  AnnoRepoBodyBase,
  EntityDetail,
} from "../../../model/AnnoRepoAnnotation.ts";
import _ from "lodash";

export const projectEntityTypes = ["tf:Ent"];
export const projectTooltipMarkerAnnotationTypes = ["tei:Ptr"];
export const projectPageMarkerAnnotationTypes = ["tf:Page"];
export const projectInsertTextMarkerAnnotationTypes = ["tei:Metamark"];

export type ProjectEntityBody = AnnoRepoBodyBase & {
  type: "tf:Ent";
  metadata: {
    details: EntityDetail[];
    n: string;
  };
};

export function isEntity(
  toTest: AnnoRepoBodyBase,
): toTest is ProjectEntityBody {
  return projectEntityTypes.includes(toTest.type);
}

export function getEntityCategory(annoRepoBody: AnnoRepoBody) {
  return _.get(annoRepoBody, "metadata.kind") ?? "unknown";
}
