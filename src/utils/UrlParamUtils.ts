import isBoolean from "lodash/isBoolean";
import isNumber from "lodash/isNumber";
import toNumber from "lodash/toNumber";
import { QUERY } from "../components/Search/SearchUrlParams.ts";
import { Base64 } from "js-base64";
import { SearchParams, SearchQuery } from "../model/Search.ts";
import _ from "lodash";

/**
 * Merge the properties in {@link toPopulate} with
 * params of the same name in ${@link urlParams}.
 * When not found, keep value of {@link toPopulate}.
 * Url param are comverted to number or boolean
 * to match original type in {@link toPopulate}
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

export function createUrlParams(
  allParams: object,
  searchParams: SearchParams,
  searchQuery: SearchQuery,
  overwriteParams?: object,
): Record<string, string> {
  return _({
    ...allParams,
    ...searchParams,
    query: encodeSearchQuery(searchQuery),
    ...overwriteParams,
  })
    .pickBy((v) => !_.isNil(v))
    .mapValues((v) => `${v}`)
    .value();
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

Object.assign(window, { Base64 });
