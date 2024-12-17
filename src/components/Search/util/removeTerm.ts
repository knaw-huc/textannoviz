import pull from "lodash/pull";
import { Terms } from "../../../model/Search.ts";

export function removeTerm(
  update: Terms,
  facetName: string,
  facetOptionName: string,
) {
  const facetToUpdate = update[facetName];
  if (facetToUpdate.length > 1) {
    pull(facetToUpdate, facetOptionName);
  } else {
    delete update[facetName];
  }
}
