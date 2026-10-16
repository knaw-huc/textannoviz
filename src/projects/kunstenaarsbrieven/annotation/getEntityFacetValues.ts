import { castArray, compact } from "lodash";
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
        // The index aggregates the full search label — for Van Gogh
        // "<surname>, <title> (<dates>)" — not head, which holds the short
        // title alone. Optional throughout: a ref carries only the languages
        // its project has, and a missing one must drop out rather than throw,
        // since this runs for every entity of every project sharing this model.
        artworksEN: compact(refs.map((ref) => ref.label?.en?.search)),
        artworksNL: compact(refs.map((ref) => ref.label?.nl?.search)),
      };
    }
  }
  return {};
}
