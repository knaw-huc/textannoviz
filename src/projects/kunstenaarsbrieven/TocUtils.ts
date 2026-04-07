import { AnnoRepoBodyBase } from "../../model/AnnoRepoAnnotation.ts";
import { isHeadBody } from "./annotation/ProjectAnnotationModel.ts";

const TOC_PREFIX = "toc-";

export function getTocId(body: AnnoRepoBodyBase): string | undefined {
  if (isHeadBody(body)) {
    return `${TOC_PREFIX}${body["xml:id"]}`;
  }
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
