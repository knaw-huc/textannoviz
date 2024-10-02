import { pull } from "lodash";
import { Terms } from "../../../model/Search.ts";

export function removeTerm(
  update: Terms,
  facetName: string,
  facetOptionName: string,
  nesting?: string,
) {
  const flatFacetToUpdate = update[facetName] as string[];

  if (flatFacetToUpdate) {
    if (flatFacetToUpdate.length > 1) {
      pull(flatFacetToUpdate, facetOptionName);
    } else {
      delete update[facetName];
    }
  }

  if (nesting) {
    const nestedFacetToUpdate = update[nesting] as Record<string, string[]>;
    if (nestedFacetToUpdate && nestedFacetToUpdate[facetName]) {
      if (nestedFacetToUpdate[facetName].length > 1) {
        pull(nestedFacetToUpdate[facetName], facetOptionName);
      } else {
        delete nestedFacetToUpdate[facetName];
      }
      if (Object.keys(nestedFacetToUpdate).length === 0) {
        delete update[nesting];
      }
    }
  }
}
