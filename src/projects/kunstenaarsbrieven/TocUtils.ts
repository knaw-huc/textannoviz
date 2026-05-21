import {
  AnnoRepoAnnotation,
  AnnoRepoBodyBase,
} from "../../model/AnnoRepoAnnotation.ts";
import { isHeadBody } from "./annotation/ProjectAnnotationModel.ts";
import { isLetterDetailPage } from "./isLetterDetailPage.ts";
import { languageCodes } from "../../model/Language.ts";

const TOC_PREFIX = "toc-";

export const showToc = (annotations: AnnoRepoAnnotation[]) =>
  !isLetterDetailPage(annotations);

export function getTocId(body: AnnoRepoBodyBase): string | undefined {
  if (!isHeadBody(body)) {
    return;
  }
  let id = body["xml:id"];
  const foundLanguage = languageCodes.find((code) => id.includes(`.${code}.`));
  if (foundLanguage) {
    id = id.replace(`.${foundLanguage}`, "");
  }
  const tocId = `${TOC_PREFIX}${id}`;
  return tocId;
}

/**
 * Get nesting level from the head body.n property:
 * - n = "1" --> level 0
 * - n = "1.1" --> level 1
 * - n = "1.1.2" --> level 2
 * Return null when no n.
 */
export function getTocLevel(n?: string): number | null {
  if (!n) {
    return null;
  }
  return n.split(".").length - 1;
}
