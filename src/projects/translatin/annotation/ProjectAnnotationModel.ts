import { normalizeClassname } from "../../../components/Text/Annotated/utils/createAnnotationClasses";
import { AnnoRepoBody } from "../../../model/AnnoRepoAnnotation";

const head = "Head";
const highlight = "Highlight";
const quote = "Quote";

export const projectHighlightedTypes = [head, quote, highlight];

export function getAnnotationCategory(annoRepoBody: AnnoRepoBody) {
  return normalizeClassname(annoRepoBody.type);
}
