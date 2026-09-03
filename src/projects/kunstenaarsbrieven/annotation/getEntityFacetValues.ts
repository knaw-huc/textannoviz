import { castArray } from "lodash";
import { AnnoRepoBodyBase } from "../../../model/AnnoRepoAnnotation";
import { FacetName } from "../../../model/Search";
import { isArtwork, isPerson } from "./ProjectAnnotationModel";

export function getEntityFacetValues(
  body: AnnoRepoBodyBase,
): Record<FacetName, string[]> {
  if (isPerson(body)) {
    const refs = castArray(body["tei:ref"]);
    return {
      personIds: refs.map((ref) => ref.id),
      persons: refs.map((ref) => ref.sortLabel),
    };
  }
  if (isArtwork(body)) {
    if (body["tei:ref"]) {
      const refs = castArray(body["tei:ref"]);
      return {
        artworkIds: refs.map((ref) => ref.id),
        artworksEN: refs.map((ref) => ref.head["en"]),
        artworksNL: refs.map((ref) => ref.head["nl"]),
      };
    }
  }
  return {};
}
