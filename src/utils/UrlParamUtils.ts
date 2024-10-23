import isBoolean from "lodash/isBoolean";
import isNumber from "lodash/isNumber";
import mapValues from "lodash/mapValues";
import toNumber from "lodash/toNumber";
import { QUERY } from "../components/Search/SearchUrlParams.ts";
import { Base64 } from "js-base64";
import { SearchParams, SearchQuery } from "../model/Search.ts";

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

/**
 * Add properties of ${@link update} to {@link urlParams}
 * or overwrite existing values
 */
export function addParamsToUrl<T extends object>(
  urlParams: URLSearchParams,
  update: T,
): Record<string, string> {
  return {
    ...urlParams,
    ...mapValues(update, (v) => `${v}`),
  };
}

export function updateUrlParams(
  urlParams: URLSearchParams,
  searchParams: SearchParams,
  searchQuery: SearchQuery,
): Record<string, string> {
  return addParamsToUrl(urlParams, {
    ...searchParams,
    query: encodeSearchQuery(searchQuery),
  });
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
