import isBoolean from "lodash/isBoolean";
import isNumber from "lodash/isNumber";
import toNumber from "lodash/toNumber";
import { QUERY } from "../components/Search/SearchUrlParams.ts";
import { Base64 } from "js-base64";
import { SearchParams, SearchQuery } from "../model/Search.ts";
import _, { isNil, isObject, isString, isUndefined } from "lodash";
import { Any } from "./Any.ts";
import {
  blankParams,
  SearchQueryAndParamUrlParams,
} from "../components/Search/createSearchParams.tsx";
import isEmpty from "lodash/isEmpty";
import { SearchUrlState } from "../components/Search/useSearchUrlParamsStore.ts";

/**
 * Use template to convert url params to correct type
 * Remove properties that are null or undefined
 */
export function getUrlSearchParamsFromUrl(
  template: SearchQueryAndParamUrlParams,
  urlParams: URLSearchParams,
): Partial<SearchParams> {
  return Object.fromEntries(
    Object.entries(template)
      .map(([k, templateValue]) => {
        const urlValue = urlParams.get(k);
        if (_.isNil(urlValue)) {
          // Filter out later on
          return [k, urlValue];
        } else if (isNumber(templateValue)) {
          return [k, toNumber(urlValue)];
        } else if (isBoolean(templateValue)) {
          return [k, urlValue === "true"];
        } else if (isString(templateValue)) {
          return [k, urlValue];
        } else if (isObject(templateValue)) {
          return [k, decodeObject(urlValue)];
        } else {
          throw new Error(`Unexpected type: ${k}=${templateValue}`);
        }
      })
      .filter(([, v]) => !_.isNil(v)),
  );
}

type ParamValueType = string | boolean | number;
type UrlSearchParamRecord = Record<string, ParamValueType>;

function isEmptyObject(v: Any) {
  return isObject(v) && isEmpty(v);
}

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
    .filter((v) => {
      if (!isObject(v)) {
        return true;
      }
      throw new Error("Can not clean object");
    })
    .mapValues((v) => `${v}`)
    .value() as Record<string, string>;
}

export function toUrlParams(
  merged: UrlSearchParamRecord,
): Record<string, string> {
  return _(merged)
    .pickBy((v) => !isNil(v) && !isEmptyObject(v))
    .mapValues((v) => (isObject(v) ? encodeObject(v) : `${v}`))
    .value() as Record<string, string>;
}

export function encodeObject(decoded: object): string {
  const result = Base64.toBase64(JSON.stringify(decoded));
  console.log("encodeSearchQuery", {
    query: decoded,
    result,
    isEmpty: isEmptyObject(decoded),
  });
  return result;
}

function decodeObject(encoded: string | null) {
  if (!encoded) {
    return {};
  }
  return JSON.parse(Base64.fromBase64(encoded));
}

export function getUrlSearchQueryFromUrl(
  urlParams: URLSearchParams,
): Partial<SearchQuery> {
  const queryEncoded = urlParams.get(QUERY);
  return decodeObject(queryEncoded);
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
    const cleaned = toUrlParams(toUpdate);
    setUrlParams(urlUpdate.searchParams, cleaned);
  }
  if (toRemove) {
    for (const key of toRemove) {
      urlUpdate.searchParams.delete(key);
    }
  }
  history.pushState(null, "", urlUpdate);
}

export function getSearchUrlStateFromUrl(): SearchUrlState {
  const urlParams = getUrlParams();
  return {
    urlParams: getUrlSearchParamsFromUrl(blankParams, urlParams),
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
  // Should contain all relevant keys:
  template: Record<string, Any>,
): UpdateOrRemoveParams {
  const toUpdate: Record<string, Any> = {};
  const toRemove: string[] = [];
  _.forOwn(template, (_, k) => {
    if (isUndefined(update[k])) {
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
    return { toUpdate: { query: encodeObject(query) } };
  }
}

export function addDefaultQuery(
  defaultQuery: SearchQuery,
  deduplicated: Partial<SearchQuery>,
) {
  return { ...defaultQuery, ...deduplicated };
}
