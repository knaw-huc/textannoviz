import isBoolean from "lodash/isBoolean";
import isNumber from "lodash/isNumber";
import toNumber from "lodash/toNumber";
import { QUERY } from "../components/Search/SearchUrlParams.ts";
import { Base64 } from "js-base64";
import { SearchQuery } from "../model/Search.ts";
import isNil from "lodash/isNil";
import pickBy from "lodash/pickBy";
import mapValues from "lodash/mapValues";

/**
 * Merge the properties in {@link toPopulate} with params of the same name in ${@link urlParams}.
 * Url param are converted to number or boolean to match the type in {@link toPopulate}.
 */
export function getSearchParamsFromUrl<T extends UrlSearchParamRecord>(
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

type ParamValueType = string | boolean | number;
export type UrlSearchParamRecord = Record<string, ParamValueType>;

/**
 * Clean up record:
 * - remove params that are null or undefined
 * - convert param values to string
 */
export function cleanUrlParams(
  merged: UrlSearchParamRecord,
): Record<string, string> {
  const notNill = pickBy(merged, (v) => !isNil(v));
  const asStrings = mapValues(notNill, (v) => `${v}`);
  return asStrings;
}

export function encodeSearchQuery(query: SearchQuery): string {
  return Base64.toBase64(JSON.stringify(query));
}

export function getSearchQueryFromUrl(
  baseSearchQuery: SearchQuery,
  urlParams: URLSearchParams,
): SearchQuery {
  const queryEncoded = urlParams.get(QUERY);
  if (!queryEncoded) {
    return baseSearchQuery;
  }
  const parsed: Partial<SearchQuery> = JSON.parse(
    Base64.fromBase64(queryEncoded),
  );
  return { ...baseSearchQuery, ...parsed };
}

export function getUrlParams(): URLSearchParams {
  return new URLSearchParams(window.location.search);
}

export function setUrlParams(
  toMutate: URLSearchParams,
  mutateWith: Record<string, string>,
): void {
  for (const key in mutateWith) {
    toMutate.set(key, mutateWith[key]);
  }
}

export function pushUrlParamsToHistory(
  toSet: Record<string, string> | URLSearchParams,
): void {
  const stringRecord =
    toSet instanceof URLSearchParams ? Object.fromEntries(toSet) : toSet;
  const updatedUrl = new URL(window.location.toString());
  setUrlParams(updatedUrl.searchParams, stringRecord);
  history.pushState(null, "", updatedUrl);
}
