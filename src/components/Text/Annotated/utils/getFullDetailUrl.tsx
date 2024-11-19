import { SearchParams, SearchQuery } from "../../../../model/Search.ts";
import { createUrlParams } from "../../../../utils/UrlParamUtils.ts";

export function getFullDetailUrl(
  tier2: string,
  detailParams: { highlight?: string },
  searchParams: SearchParams,
  searchQuery: SearchQuery,
): string {
  return `/detail/${tier2}?${new URLSearchParams(
    createUrlParams(detailParams, searchParams, searchQuery),
  )}`;
}
