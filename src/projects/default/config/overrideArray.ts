import { Any } from "../../../utils/Any";

export function overrideArrays(_: Any, srcValue: Any) {
  if (Array.isArray(srcValue)) {
    return srcValue;
  }
  return undefined;
}
