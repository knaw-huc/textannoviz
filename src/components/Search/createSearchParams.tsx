import { ProjectConfig } from "../../model/ProjectConfig.ts";
import { DetailParams, SearchParams, SearchQuery } from "../../model/Search.ts";
import { blankSearchQuery } from "../../stores/search/default-query-slice.ts";

export const blankSearchParams: SearchParams = {
  indexName: "",
  fragmentSize: 100,
  from: 0,
  size: 10,
  sortBy: "_score",
  sortOrder: "desc",
};

export const blankDetailParams: DetailParams = {
  lastSearchResult: undefined,
};

export type SearchUrlState = Partial<
  SearchParams & {
    query: Partial<SearchQuery>;
  } & DetailParams
>;

export const blankParams: SearchUrlState = {
  ...blankSearchParams,
  query: blankSearchQuery,
  lastSearchResult: undefined,
};

export function createSearchParams(props: { projectConfig: ProjectConfig }) {
  return {
    ...blankSearchParams,
    ...props.projectConfig.overrideDefaultSearchParams,
  };
}
