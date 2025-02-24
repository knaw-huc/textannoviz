import isBoolean from "lodash/isBoolean";
import isNumber from "lodash/isNumber";
import toNumber from "lodash/toNumber";
import _, { isPlainObject, isString, isUndefined } from "lodash";
import { Any } from "./Any.ts";
import isEmpty from "lodash/isEmpty";
import * as qs from "qs";
import { ParsedQs } from "qs";

import { UrlStateItem } from "../components/Search/createUrlStorage.ts";

/**
 * Use template to convert url params to correct type
 * Remove properties that are null or undefined
 */
export function getTypedParamsFromUrl<T extends object>(
  template: T,
  urlParams: ParsedQs,
): Partial<T> {
  return Object.fromEntries(
    Object.entries(template)
      .map(([k, templateValue]) => {
        const urlValue = urlParams[k];
        if (_.isNil(urlValue)) {
          // Filter out later on
          return [k, urlValue];
        } else if (isNumber(templateValue)) {
          return [k, toNumber(urlValue)];
        } else if (isBoolean(templateValue)) {
          return [k, urlValue === "true"];
        } else if (isString(templateValue)) {
          return [k, urlValue];
        } else if (isPlainObject(templateValue)) {
          return [k, decodeObject(urlValue as string)];
        } else {
          throw new Error(`Unexpected type: ${k}=${templateValue}`);
        }
      })
      .filter(([, v]) => !_.isNil(v)),
  );
}

type ParamValueType = string | boolean | number | object;
type UrlSearchParamRecord = Record<string, ParamValueType>;

function isEmptyObject(v: Any) {
  return isPlainObject(v) && isEmpty(v);
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
    .pickBy((v) => {
      if (isPlainObject(v)) {
        throw new Error("Can not clean object");
      }
      return !_.isNil(v);
    })
    .mapValues((v) => `${v}`)
    .value() as Record<string, string>;
}

export function encodeObject(name: string, decoded: object): string {
  const result = qs.stringify({ [name]: decoded }, { encodeValuesOnly: true });
  console.log("encodeSearchQuery", {
    query: decoded,
    result,
    isEmpty: isEmptyObject(decoded),
  });
  return result;
}

export function decodeObject(encoded: string | null) {
  if (!encoded) {
    return {};
  }
  return qs.parse(encoded);
}

export function getUrlParams(): URLSearchParams {
  return new URLSearchParams(window.location.search);
}

export type UpdateOrRemoveParams = {
  toUpdate?: Record<string, Any>;
  toRemove?: string[];
};

/**
 * push new url with updated search url params to window.history
 */
export function pushUrlParamsToHistory(params: UpdateOrRemoveParams) {
  const { toUpdate, toRemove } = params;
  const urlUpdate = new URL(window.location.toString());
  const paramUpdate = qs.parse(window.location.search, {
    ignoreQueryPrefix: true,
  });
  if (toRemove) {
    for (const key of toRemove) {
      delete paramUpdate[key];
    }
  }

  if (toUpdate) {
    const allEntries = {
      ...paramUpdate,
      ...toUpdate,
    };
    urlUpdate.search =
      "?" + qs.stringify(allEntries, { encodeValuesOnly: true });
  }

  history.pushState(null, "", urlUpdate);
}

export function getStateFromUrl<T extends object>(
  template: T,
): UrlStateItem<T> {
  const urlParams = qs.parse(window.location.search, {
    ignoreQueryPrefix: true,
  });
  return { urlState: getTypedParamsFromUrl(template, urlParams) };
}

/**
 * Only keep query properties that differ from the default
 */
export function removeDefaultProps<T extends object>(
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
    if (isUndefined(update[k]) || isEmptyObject(update[k])) {
      toRemove.push(k);
    } else {
      toUpdate[k] = update[k];
    }
  });
  return { toUpdate, toRemove };
}
