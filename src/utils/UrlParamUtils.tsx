import isBoolean from "lodash/isBoolean";
import isNumber from "lodash/isNumber";
import mapValues from "lodash/mapValues";
import toNumber from "lodash/toNumber";
import { URLSearchParamsInit } from "react-router-dom";

/**
 * Merge the properties in {@link toPopulate} with
 * params of the same name in ${@link urlParams}.
 * When not found, keep value of {@link toPopulate}.
 * Url param are comverted to number or boolean
 * to match original type in {@link toPopulate}
 */
export function getFromUrlParams<T extends object>(
  toPopulate: T,
  urlParams: URLSearchParams,
): T {
  return Object.fromEntries(
    Object.entries(toPopulate).map(([k, v]) => {
      const urlValue = urlParams.get(k);
      if (!urlValue) {
        return [k, v];
      }
      if (isNumber(v)) {
        return [k, toNumber(urlValue)];
      } else if (isBoolean(v)) {
        return [k, urlValue === "true"];
      } else {
        return [k, urlValue];
      }
    }),
  ) as T;
}

/**
 * Add properties of ${@link toAdd} to {@link urlParams}
 * or overwrite existing values
 */
export function addToUrlParams<T extends object>(
  urlParams: URLSearchParams,
  toAdd: T,
): URLSearchParamsInit {
  return {
    ...urlParams,
    ...mapValues(toAdd, (v) => `${v}`),
  };
}
