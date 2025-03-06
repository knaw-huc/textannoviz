import { SearchQuery } from "../../model/Search.ts";
import isEqual from "lodash/isEqual";

/**
 * Search when query differs from default query
 */
export function isSearchableQuery(
  query: Partial<SearchQuery>,
  defaultQuery: Partial<SearchQuery>,
) {
  if (!query) {
    return false;
  }
  const keysToDiffer: (keyof SearchQuery)[] = [
    "fullText",
    "dateFrom",
    "dateTo",
    "terms",
  ];
  for (const key of keysToDiffer) {
    if (!isEqual(query[key], defaultQuery[key])) {
      return true;
    }
  }
  return false;
}
