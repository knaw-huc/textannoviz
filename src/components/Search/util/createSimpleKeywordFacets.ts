import {
  FacetName,
  Facets,
  FacetTypes,
  FlatFacet,
  NestedFacet,
} from "../../../model/Search";

export type FacetEntry = [FacetName, FlatFacet | NestedFacet];

export function createSimpleKeywordFacets(
  facetTypes: FacetTypes,
  facets: Facets,
  type: string,
  nestedFacets: string[],
): FacetEntry[] {
  if (!facets || !facetTypes) {
    return [];
  }

  const simpleKeywordFacets = Object.entries(facets).filter(([name]) => {
    return !nestedFacets.includes(name) && facetTypes[name] === type;
  });

  console.log(simpleKeywordFacets);

  return simpleKeywordFacets;
}
