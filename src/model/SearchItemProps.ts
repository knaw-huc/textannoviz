import { SearchQuery } from "../stores/search/search-query-slice.ts";

export type SearchItemProps<T> = {
  query: SearchQuery;
  result: T;
};
