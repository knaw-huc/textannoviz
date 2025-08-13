import { FacetTypes } from "../../model/Search";

export function getDateFacetName(facetTypes: FacetTypes) {
  return Object.entries(facetTypes).filter(
    ([, type]) => type === "date",
  )[0]?.[0];
}
