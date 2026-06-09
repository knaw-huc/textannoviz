import { Any } from "../../../utils/Any";

/* 
This function is used as a customizer in Lodash's mergeWith function in the project configs. It replaces all arrays instead of just merging them. See https://github.com/knaw-huc/textannoviz/issues/620 and https://github.com/knaw-huc/textannoviz/pull/621 for more info.
*/

export function replaceArrays(_: Any, srcValue: Any) {
  if (Array.isArray(srcValue)) {
    return srcValue;
  }
  return undefined;
}
