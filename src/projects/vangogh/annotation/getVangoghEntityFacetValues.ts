import { AnnoRepoBodyBase } from "../../../model/AnnoRepoAnnotation";
import { FacetName } from "../../../model/Search";
import { getEntityFacetValues } from "../../kunstenaarsbrieven/annotation/getEntityFacetValues";
import {
  isBibleReferenceBody,
  isJournalReference,
  isVangoghBibliographyReference,
} from "../../kunstenaarsbrieven/annotation/ProjectAnnotationModel";

export function getVangoghEntityFacetValues(
  body: AnnoRepoBodyBase,
): Record<FacetName, string[]> {
  if (isBibleReferenceBody(body)) {
    return { bibleRefs: [body.label] };
  }

  if (isVangoghBibliographyReference(body) && body.label) {
    return { worksMentioned: [body.label] };
  }

  if (isJournalReference(body) && body.label) {
    return { journals: [body.label] };
  }

  return getEntityFacetValues(body);
}
