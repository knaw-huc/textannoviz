import isBoolean from "lodash/isBoolean";
import isNumber from "lodash/isNumber";
import toNumber from "lodash/toNumber";
import { QUERY } from "../components/Search/SearchUrlParams.ts";
import { Base64 } from "js-base64";
import { SearchParams, SearchQuery } from "../model/Search.ts";
import _ from "lodash";
import { Any } from "./Any.ts";
import { blankSearchParams } from "../components/Search/createSearchParams.tsx";
import { SearchUrlState } from "../components/Search/useSearchUrlParamsStore.ts";

/**
 * Merge the properties in {@link template} with params of the same name in ${@link urlParams}.
 * Url param are converted to number or boolean to match the type in {@link template}.
 */
export function getSearchParamsFromUrl<T extends UrlSearchParamRecord>(
  template: T,
  urlParams: URLSearchParams,
): T {
  return Object.fromEntries(
    Object.entries(template).map(([k, v]) => {
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
 * Use template to convert url params to correct type
 */
export function getUrlSearchParamsFromUrl(
  template: SearchParams,
  urlParams: URLSearchParams,
): Partial<SearchParams> {
  return Object.fromEntries(
    Object.entries(template)
      .map(([k, v]) => {
        const urlValue = urlParams.get(k);
        if (_.isNil(urlValue)) {
          // Filter out later on
          return [k, urlValue];
        } else if (isNumber(v)) {
          return [k, toNumber(urlValue)];
        } else if (isBoolean(v)) {
          return [k, urlValue === "true"];
        } else if (_.isString(v)) {
          return [k, urlValue];
        } else {
          throw new Error(`Unexpected type: ${k}=${v}`);
        }
      })
      .filter(([, v]) => !_.isNil(v)),
  );
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
  return addDefaultQuery(baseSearchQuery, parsed);
}

export function getUrlSearchQueryFromUrl(
  urlParams: URLSearchParams,
): Partial<SearchQuery> {
  const queryEncoded = urlParams.get(QUERY);
  if (!queryEncoded) {
    return {};
  }
  return JSON.parse(Base64.fromBase64(queryEncoded));
}

export function getUrlParams(): URLSearchParams {
  return new URLSearchParams(window.location.search);
}

/**
 * Set url params when string
 * Delete url params when null
 */
export function setUrlParams(
  toMutate: URLSearchParams,
  mutateWith: Record<string, string>,
): void {
  for (const key in mutateWith) {
    const value = mutateWith[key];
    toMutate.set(key, value);
  }
}

export type UpdateOrRemoveParams = {
  toUpdate?: Record<string, Any>;
  toRemove?: string[];
};

/**
 * push new url with updated search url params to window.history
 */
export function pushUrlParamsToHistory({
  toUpdate,
  toRemove,
}: UpdateOrRemoveParams): void {
  const urlUpdate = new URL(window.location.toString());
  if (toUpdate) {
    const cleaned = cleanUrlParams(toUpdate);
    setUrlParams(urlUpdate.searchParams, cleaned);
  }
  if (toRemove) {
    for (const key of toRemove) {
      urlUpdate.searchParams.delete(key);
    }
  }
  history.pushState(null, "", urlUpdate);
}

export function getStateStorageItemFromUrl(): SearchUrlState {
  const urlParams = getUrlParams();
  return {
    urlSearchParams: getUrlSearchParamsFromUrl(blankSearchParams, urlParams),
    urlSearchQuery: getUrlSearchQueryFromUrl(urlParams),
  };
}

/**
 * Only keep query properties that differ from the default
 */
export function removeDefaultProps<T extends SearchQuery | SearchParams>(
  props: T,
  defaultProps: T,
): Partial<T> {
  return _.pickBy<T>(props, (v, k) => {
    return !_.isEqual(defaultProps[k as keyof T], v);
  }) as Partial<T>;
}

export function removeOrUpdateParams(
  update: Record<string, Any>,
  // Should contain all relevant keys
  template: Record<string, Any>,
): UpdateOrRemoveParams {
  const toUpdate: Record<string, Any> = {};
  const toRemove: string[] = [];
  // @ts-expect-error unused value
  _.forOwn(template, (v, k) => {
    if (_.isUndefined(update[k])) {
      toRemove.push(k);
    } else {
      toUpdate[k] = update[k];
    }
  });
  return { toUpdate, toRemove };
}

export function removeOrUpdateQuery(
  query: Partial<SearchQuery>,
): UpdateOrRemoveParams {
  if (_.isEmpty(query)) {
    return { toRemove: ["query"] };
  } else {
    return { toUpdate: { query: encodeSearchQuery(query) } };
  }
}

export function addDefaultQuery(
  defaultQuery: SearchQuery,
  deduplicated: Partial<SearchQuery>,
) {
  return { ...defaultQuery, ...deduplicated };
}
