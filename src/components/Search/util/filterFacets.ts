import {Facets, Indices} from "../../../model/Search.ts";

type FacetType = "keyword" | "date";

export const buildFacetFilter = (
    indices: Indices,
    indexName: string,
) => (
    facets: Facets,
    type: FacetType,
) => {
  if(!facets) {
    return [];
  }
  return Object.entries(facets).filter(([key]) => {
    return indices[indexName][key] === type;
  });
}