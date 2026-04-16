import { AnnoRepoAnnotation } from "../../model/AnnoRepoAnnotation.ts";
import { DetailPanelConfig } from "../../model/ProjectConfig.ts";
import { isLetterDetailPage } from "./isLetterDetailPage.ts";

export function filterPanels(
  panels: DetailPanelConfig[],
  annotations: AnnoRepoAnnotation[],
): string[] {
  if (isLetterDetailPage(annotations)) {
    return panels.map((p) => p.name);
  }

  const textPanelNames = panels
    .filter((p) => p.panel.content.props.viewToRender)
    .map((p) => p.name);

  const firstTextPanelName = textPanelNames[0];
  return panels
    .filter((p) => {
      if (textPanelNames.includes(p.name)) {
        // Hide duplicate original/translation on about page:
        return p.name === firstTextPanelName;
      } else if (p.name === "facs") {
        // Hide scan viewer on about pages:
        return false;
      } else {
        // Include all other non-text panes:
        return true;
      }
    })
    .map((p) => p.name);
}
