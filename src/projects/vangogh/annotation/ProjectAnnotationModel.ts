import get from "lodash/get";
import { normalizeClassname } from "../../../components/Text/Annotated/utils/createAnnotationClasses";
import { AnnoRepoBody } from "../../../model/AnnoRepoAnnotation";

const teiHi = "tei:Hi";
const teiHead = "tei:Head";
const teiRs = "tei:Rs";

export const projectEntityTypes = [teiRs];
export const projectHighlightedTypes = [teiHi, teiHead];
export const projectTooltipMarkerAnnotationTypes = ["tei:Ptr"];
export const projectPageMarkerAnnotationTypes = ["tf:Page"];

export function getAnnotationCategory(annoRepoBody: AnnoRepoBody) {
  if (annoRepoBody.type === teiHi) {
    return get(annoRepoBody, "metadata.rend");
  } else if (annoRepoBody.type === teiHead) {
    return normalizeClassname(teiHead);
  } else if (annoRepoBody.type === teiRs) {
    return "PER";
  } else {
    return "unknown";
  }
}

export function getHighlightCategory(annoRepoBody: AnnoRepoBody) {
  if (annoRepoBody.type === teiHi) {
    return get(annoRepoBody, "metadata.rend");
  } else if (annoRepoBody.type === teiHead) {
    return normalizeClassname(teiHead);
  } else {
    console.warn("Could not find highlight category", annoRepoBody);
    return "unknown";
  }
}
