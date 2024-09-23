import {
  AnnoRepoBody,
  AnnoRepoBodyBase,
  EntityDetail,
} from "../../../model/AnnoRepoAnnotation.ts";
import _ from "lodash";

/**
 * Highlighted element
 */
const teiHi = "tei:Hi";
const tfEnt = "tf:Ent";
export const projectEntityTypes = [tfEnt];
export const projectHighlightedTypes = [teiHi];
export const projectTooltipMarkerAnnotationTypes = [
  /**
   * Pointer pointing to a tei:Note
   * see {@link MarkerTooltip}
   * TODO: move to project config
   */
  "tei:Ptr",
];
export const projectPageMarkerAnnotationTypes = ["tf:Page"];
export const projectInsertTextMarkerAnnotationTypes = [
  /**
   * Notes from the editor about what he encountered on the facsimile
   */
  "tei:Metamark",
];

type EntBody = {
  type: "tf:Ent";
  metadata: {
    details: EntityDetail[];
    n: string;
  };
};

export type ProjectEntityBody = AnnoRepoBodyBase & EntBody;

export function isEntity(
  toTest: AnnoRepoBodyBase,
): toTest is ProjectEntityBody {
  return projectEntityTypes.includes(toTest.type);
}

export function getAnnotationCategory(annoRepoBody: AnnoRepoBody) {
  if (annoRepoBody.type === tfEnt) {
    return _.get(annoRepoBody, "metadata.kind") ?? "unknown";
  }
  if (annoRepoBody.type === teiHi) {
    const category = _.get(annoRepoBody, "metadata.rend");
    console.log("hi as ", category);
    return category;
  }
}
