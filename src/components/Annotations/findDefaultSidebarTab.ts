import { AnnoRepoAnnotation } from "../../model/AnnoRepoAnnotation.ts";
import { ProjectConfig } from "../../model/ProjectConfig.ts";

/**
 * Sidebar tab to open on a newly loaded page:
 * the project's default, or else the toc when shown, or else metadata
 */
export function findDefaultSidebarTab(
  config: ProjectConfig,
  annotations: AnnoRepoAnnotation[],
): string {
  if (config.getDefaultSidebarTab) {
    return config.getDefaultSidebarTab(annotations);
  }
  return config.showToc(annotations) ? "toc" : "metadata";
}
