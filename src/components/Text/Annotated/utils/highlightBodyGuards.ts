import { AnnoRepoBody } from "../../../../model/AnnoRepoAnnotation.ts";

type SearchHighlightBody = {
  id: string;
  type: "search";
};

export type HighlightBody = SearchHighlightBody | AnnoRepoBody;

export function isSearchHighlightBody(
  toTest: HighlightBody,
): toTest is SearchHighlightBody {
  return (toTest as SearchHighlightBody).type === "search";
}

export function isAnnotationHighlightBody(
  toTest: HighlightBody,
): toTest is AnnoRepoBody {
  return !isSearchHighlightBody(toTest);
}
