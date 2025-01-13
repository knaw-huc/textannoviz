import isBoolean from "lodash/isBoolean";
import isNumber from "lodash/isNumber";
import toNumber from "lodash/toNumber";
import { QUERY } from "../components/Search/SearchUrlParams.ts";
import { Base64 } from "js-base64";
import { SearchParams, SearchQuery } from "../model/Search.ts";
import _ from "lodash";

/**
 * Merge the properties in {@link toPopulate} with params of the same name in ${@link urlParams}.
 * Url param are converted to number or boolean to match the type in {@link toPopulate}.
 */
export function getSearchParamsFromUrl<T extends object>(
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
 * Clean up record:
 * - remove params that are null or undefined
 * - convert param values to string
 */
export function cleanUrlParams(merged: object): Record<string, string> {
  return _(merged)
    .pickBy((v) => !_.isNil(v))
    .mapValues((v) => `${v}`)
    .value() as Record<string, string>;
}

export function createUrlParams(
  allParams: object,
  searchParams: SearchParams,
  searchQuery: SearchQuery,
  overwriteParams?: object,
): Record<string, string> {
  const merged = {
    ...allParams,
    ...searchParams,
    query: encodeSearchQuery(searchQuery),
    ...overwriteParams,
  };
  const cleaned = cleanUrlParams(merged);
  return cleaned;
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

export function getUrlParams() {
  return new URLSearchParams(window.location.search);
}

export function setUrlParams(toUpdate: Record<string, string>) {
  const updatedUrl = new URL(window.location.toString());
  for (const key in toUpdate) {
    updatedUrl.searchParams.set(key, toUpdate[key]);
  }
  history.pushState(null, "", updatedUrl);
}
