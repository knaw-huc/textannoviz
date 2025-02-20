import { ProjectConfig } from "../../model/ProjectConfig.ts";
import { SearchParams, SearchQuery } from "../../model/Search.ts";
import { blankSearchQuery } from "../../stores/search/default-query-slice.ts";

export const blankSearchParams: SearchParams = {
  indexName: "",
  fragmentSize: 100,
  from: 0,
  size: 10,
  sortBy: "_score",
  sortOrder: "desc",
};

export type SearchUrlState = Partial<
  SearchParams & {
    query: Partial<SearchQuery>;
  }
>;

export const blankParams: SearchUrlState = {
  ...blankSearchParams,
  query: blankSearchQuery,
};

export function createSearchParams(props: { projectConfig: ProjectConfig }) {
  return {
    ...blankSearchParams,
    ...props.projectConfig.overrideDefaultSearchParams,
  };
}
