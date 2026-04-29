import {
  AnnoRepoBodyBase,
  EntityDetail,
} from "../../../model/AnnoRepoAnnotation.ts";
import _ from "lodash";
import { normalizeClassname } from "../../../components/Text/Annotated/utils/createAnnotationClasses.ts";

/**
 * Highlighted element
 */
const teiHi = "tei:Hi";
const teiHead = "tei:Head";
const tfEnt = "tf:Ent";
export const entityTypes = [tfEnt];
export const highlightTypes = [teiHi, teiHead];
export const tooltipMarkerTypes = [
  /**
   * Pointer pointing to a tei:Note
   * see {@link MarkerTooltip}
   */
  "tei:Ptr",
];
export const markerTypes = ["tf:Page"];
export const insertTextMarkerTypes = [
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
  return entityTypes.includes(toTest.type);
}

export function getAnnotationCategory(annoRepoBody: AnnoRepoBodyBase) {
  if (annoRepoBody.type === tfEnt) {
    return _.get(annoRepoBody, "metadata.kind") ?? "unknown";
  } else if (annoRepoBody.type === teiHi) {
    return _.get(annoRepoBody, "metadata.rend");
  } else if (annoRepoBody.type === teiHead) {
    return normalizeClassname(teiHead);
  } else {
    console.warn("Could not find annotation category", annoRepoBody);
    return "unknown";
  }
}

export function getHighlightCategory(annoRepoBody: AnnoRepoBodyBase) {
  if (annoRepoBody.type === teiHi) {
    return _.get(annoRepoBody, "metadata.rend");
  } else if (annoRepoBody.type === teiHead) {
    return normalizeClassname(teiHead);
  } else {
    console.warn("Could not find highlight category", annoRepoBody);
    return "unknown";
  }
}
