import { FacetType, FacetTypes } from "../../model/Search";

export function filterFacetTypesByType(
  facetTypes: FacetTypes,
  type: FacetType,
) {
  if (!facetTypes) {
    return [];
  }
  return Object.entries(facetTypes)
    .filter(([, facetType]) => {
      return facetType === type;
    })
    .map(([name]) => name);
}
