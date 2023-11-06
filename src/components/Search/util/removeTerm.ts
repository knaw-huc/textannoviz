import {Terms} from "../../../model/Search.ts";
import * as _ from "lodash";

export function removeTerm(update: Terms, facetName: string, facetOptionName: string) {
  const facetToUpdate = update[facetName];
  if (facetToUpdate.length > 1) {
    _.pull(facetToUpdate, facetOptionName)
  } else {
    delete update[facetName];
  }
}
