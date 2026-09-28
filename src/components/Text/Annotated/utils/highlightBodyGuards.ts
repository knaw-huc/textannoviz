import { AnnoRepoBody } from "../../../../model/AnnoRepoAnnotation.ts";
import { FacetName } from "../../../../model/Search.ts";

type SearchHighlightBody = {
  id: string;
  type: "search";
};

type EntityHighlightBody = {
  id: string;
  type: "entity-match";
  facetName: FacetName;
  bodyId: string;
};

export type HighlightBody =
  | SearchHighlightBody
  | EntityHighlightBody
  | AnnoRepoBody;

export function isSearchHighlightBody(
  toTest: HighlightBody,
): toTest is SearchHighlightBody {
  return (toTest as SearchHighlightBody).type === "search";
}

export function isEntityHighlightBody(
  toTest: HighlightBody,
): toTest is EntityHighlightBody {
  return (toTest as EntityHighlightBody).type === "entity-match";
}

export function isAnnotationHighlightBody(
  toTest: HighlightBody,
): toTest is AnnoRepoBody {
  return !isSearchHighlightBody(toTest) && !isEntityHighlightBody(toTest);
}
