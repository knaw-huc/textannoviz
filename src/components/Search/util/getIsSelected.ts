import { Terms } from "../../../model/Search";

export function getIsSelected(
  facetValueName: string,
  facetLabelName: string,
  facetName: string,
  selectedFacets: Terms,
) {
  return Object.entries(selectedFacets).some(([key, value]) => {
    if (facetLabelName.startsWith(key)) {
      if (Array.isArray(value)) {
        return value.includes(facetValueName);
      } else if (typeof value === "object" && value[facetName]) {
        return value[facetName].includes(facetValueName);
      }
    }
    return false;
  });
}
