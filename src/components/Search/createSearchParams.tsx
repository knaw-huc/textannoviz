import { ProjectConfig } from "../../model/ProjectConfig.ts";
import { SearchParams } from "../../model/Search.ts";

export const blankSearchParams: SearchParams = {
  indexName: "",
  fragmentSize: 100,
  from: 0,
  size: 10,
  sortBy: "_score",
  sortOrder: "desc",
};

export function createSearchParams(props: { projectConfig: ProjectConfig }) {
  return {
    ...blankSearchParams,
    ...props.projectConfig.overrideDefaultSearchParams,
  };
}
