import { AnnoRepoAnnotation } from "../../model/AnnoRepoAnnotation.ts";
import { ProjectConfig } from "../../model/ProjectConfig.ts";

export function getHighlightColor(
  annotation: AnnoRepoAnnotation,
  projectConfig: ProjectConfig,
): string {
  if (projectConfig.id === "republic") {
    switch (annotation.body.type) {
      case "Resolution":
        return projectConfig.colours.resolution;
      case "Attendant":
        return projectConfig.colours.attendant;
      case "Reviewed":
        return projectConfig.colours.reviewed;
      case "AttendanceList":
        return projectConfig.colours.attendancelist;
      case "TextRegion":
        return projectConfig.colours.textregion;
      default:
        return "transparent";
    }
  }
  switch (annotation.body.type) {
    case "px:TextRegion":
      return projectConfig.colours.textregion;
    case "px:TextLine":
      return projectConfig.colours.textline;
    case "tt:Entity":
      return projectConfig.colours.entity;
    default:
      return "blue";
  }
}
