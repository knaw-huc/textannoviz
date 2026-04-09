import { AnnoRepoAnnotation } from "../../model/AnnoRepoAnnotation.ts";
import { DetailPanelConfig } from "../../model/ProjectConfig.ts";
import { isLetterDetailPage } from "./isLetterDetailPage.ts";

/**
 * On about pages, only show the first text panel
 * (orig and trans are identical)
 */
export function filterPanels(
  panels: DetailPanelConfig[],
  annotations: AnnoRepoAnnotation[],
): DetailPanelConfig[] {
  if (isLetterDetailPage(annotations)) {
    return panels;
  }

  const textPanelNames = panels
    .filter((p) => p.panel.content.props.viewToRender)
    .map((p) => p.name);

  const firstTextPanelName = textPanelNames[0];
  return panels.filter((p) => {
    if (textPanelNames.includes(p.name)) {
      return p.name === firstTextPanelName;
    } else {
      // Show all non-text panes:
      return true;
    }
  });
}
