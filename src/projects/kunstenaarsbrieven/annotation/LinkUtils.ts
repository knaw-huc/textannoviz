import { AnnoRepoBodyBase } from "../../../model/AnnoRepoAnnotation.ts";
import {
  BibliographyReferenceBody,
  isReference,
} from "./ProjectAnnotationModel.ts";

/**
 * body.url should be an external URL
 */
export const isLink = (
  toTest?: AnnoRepoBodyBase,
): toTest is BibliographyReferenceBody => {
  if (!isReference(toTest)) {
    return false;
  }
  const ref = toTest as BibliographyReferenceBody;
  return isExternalUrl(ref.url);
};

export const getUrl = (toTest?: AnnoRepoBodyBase): string | undefined => {
  if (!isLink(toTest)) {
    return;
  }
  return toTest.url;
};

function isExternalUrl(toTest?: string): boolean {
  if (!toTest) {
    return false;
  }
  if (!isUrl(toTest)) {
    return false;
  }
  const url = new URL(toTest);
  return url.origin !== window.location.origin;
}

function isUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
