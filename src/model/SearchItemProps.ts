import { SearchQuery } from "./Search.ts";

export type SearchItemProps<T> = {
  query: SearchQuery;
  result: T;
};
