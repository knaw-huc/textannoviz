import { ProjectConfig } from "../../model/ProjectConfig.ts";
import { SearchParams } from "../../model/Search.ts";

export const defaultSearchParams: SearchParams = {
  fragmentSize: 100,
  from: 0,
  size: 10,
  sortBy: "_score",
  sortOrder: "desc",
};

export function createSearchParams(props: { projectConfig: ProjectConfig }) {
  return {
    ...defaultSearchParams,
    ...props.projectConfig.overrideDefaultSearchParams,
  };
}
