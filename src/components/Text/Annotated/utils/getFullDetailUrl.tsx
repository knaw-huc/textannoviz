import { SearchParams, SearchQuery } from "../../../../model/Search.ts";
import { createUrlParams } from "../../../../utils/UrlParamUtils.ts";

// TODO: Get rid of this function:
//  detail nav hook does not need to know about search params and query
export function createUrlSearchParams(
  searchParams: SearchParams,
  searchQuery: SearchQuery,
  overwriteParams: object,
) {
  return new URLSearchParams(
    createUrlParams({}, searchParams, searchQuery, overwriteParams),
  );
}
