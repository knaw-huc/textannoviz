import {
  FacetEntry,
  Facets,
  FacetType,
  FacetTypes,
} from "../../model/Search.ts";

export function filterFacetsByType(
  facetTypes: FacetTypes,
  facets: Facets,
  type: FacetType,
): FacetEntry[] {
  if (!facets || !facetTypes) {
    return [];
  }
  return Object.entries(facets).filter(([name]) => {
    return facetTypes[name] === type;
  });
}
