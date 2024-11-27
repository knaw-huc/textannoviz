import { SearchParams, SearchQuery } from "../../../../model/Search.ts";
import { createUrlParams } from "../../../../utils/UrlParamUtils.ts";

export function createUrlSearchParams(
  searchParams: SearchParams,
  searchQuery: SearchQuery,
  overwriteParams: object,
) {
  return new URLSearchParams(
    createUrlParams({}, searchParams, searchQuery, overwriteParams),
  );
}

export function getDetailPath(tier2: string) {
  return `/detail/${tier2}`;
}
