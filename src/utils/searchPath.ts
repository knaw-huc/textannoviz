import { ProjectConfig } from "../model/ProjectConfig";
import { projectConfigSelector, useProjectStore } from "../stores/project";

/**
 * Path of the search route, relative to the router basename.
 * Used both to define the route and to link to it, so that the two cannot drift.
 */
export const searchRoutePath = "search";

/**
 * Projects with a {@link ProjectConfig.homePage} render that page at "/"
 * and move search to {@link searchRoutePath}. All other projects keep search at "/".
 */
export function getSearchPath(config: ProjectConfig) {
  return config.homePage ? `/${searchRoutePath}` : "/";
}

export function useSearchPath() {
  return getSearchPath(useProjectStore(projectConfigSelector));
}
