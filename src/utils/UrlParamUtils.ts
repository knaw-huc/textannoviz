import isBoolean from "lodash/isBoolean";
import isNumber from "lodash/isNumber";
import toNumber from "lodash/toNumber";
import { QUERY } from "../components/Search/SearchUrlParams.ts";
import { Base64 } from "js-base64";
import { SearchQuery } from "../model/Search.ts";
import _ from "lodash";

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
type UrlSearchParamRecord = Record<string, ParamValueType>;

/**
 * Clean up record:
 * - remove params that are null or undefined
 * - convert param values to string
 */
export function cleanUrlParams(
  merged: UrlSearchParamRecord,
): Record<string, string> {
  return _(merged)
    .pickBy((v) => !_.isNil(v))
    .mapValues((v) => `${v}`)
    .value() as Record<string, string>;
}

export function encodeSearchQuery(query: Partial<SearchQuery>): string {
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

/**
 * Only keep query properties that differ from the default
 */
export function removeDefaultQuery(
  query: SearchQuery,
  defaultQuery: SearchQuery,
): Partial<SearchQuery> {
  return _.pickBy<SearchQuery>(query, (v, k) => {
    return !_.isEqual(defaultQuery[k as keyof SearchQuery], v);
  });
}

export function addDefaultQuery(
  defaultQuery: SearchQuery,
  deduplicated: Partial<SearchQuery>,
) {
  return { ...defaultQuery, ...deduplicated };
}
