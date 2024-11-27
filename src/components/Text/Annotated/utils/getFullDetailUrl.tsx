import { SearchParams, SearchQuery } from "../../../../model/Search.ts";
import { createUrlParams } from "../../../../utils/UrlParamUtils.ts";

export function getFullDetailUrl(
  tier2: string,
  searchParams: SearchParams,
  searchQuery: SearchQuery,
  overwriteParams: object,
): string {
  return `${getDetailPath(tier2)}?${new URLSearchParams(
    createUrlParams({}, searchParams, searchQuery, overwriteParams),
  )}`;
}

export function getDetailPath(tier2: string) {
  return `/detail/${tier2}`;
}
