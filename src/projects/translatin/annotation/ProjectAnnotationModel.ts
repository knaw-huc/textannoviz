import _ from "lodash";
import { normalizeClassname } from "../../../components/Text/Annotated/utils/createAnnotationClasses";
import { AnnoRepoBody } from "../../../model/AnnoRepoAnnotation";

const teiHi = "tei:Hi";
const teiHead = "tei:Head";

export const projectHighlightedTypes = [teiHi, teiHead];

export function getHighlightCategory(annoRepoBody: AnnoRepoBody) {
  if (annoRepoBody.type === teiHi) {
    return _.get(annoRepoBody, "metadata.rend");
  } else if (annoRepoBody.type === teiHead) {
    return normalizeClassname(teiHead);
  } else {
    console.warn("Could not find annotation category", annoRepoBody);
  }
  return "unknown";
}
