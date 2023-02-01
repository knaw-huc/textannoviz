import {
  AnnoRepoAnnotation,
  AttendantBody,
  ResolutionBody,
  SessionBody,
} from "../../../../model/AnnoRepoAnnotation";
import { ProjectConfig } from "../../../../model/ProjectConfig";

export const republicConfig: ProjectConfig = {
  id: "republic",

  colours: {
    resolution: "green",
    attendant: "#DB4437",
    reviewed: "blue",
    attendancelist: "yellow",
  },

  relativeTo: "Scan",
  annotationTypesToInclude: [
    "Session, Resolution, Reviewed, AttendanceList, Attendant",
  ],
  broccoliVersion: "v3",
  tier: ["volumes", "openings"],
  bodyType: ["Session", "Resolution", "Attendant"],

  renderAnnotationItem: (annotation: AnnoRepoAnnotation) => {
    switch (annotation.body.type) {
      case republicConfig.bodyType[0]:
        return (
          (annotation.body as SessionBody).metadata.sessionWeekday +
          ", " +
          `${(annotation.body as SessionBody).metadata.sessionDate}`
        );
      case republicConfig.bodyType[1]:
        return (
          (annotation.body as ResolutionBody).metadata.propositionType +
          " (" +
          `${annotation.body.type}` +
          ")"
        );
      case republicConfig.bodyType[2]:
        return (
          (annotation.body as AttendantBody).metadata.delegateName +
          " (" +
          `${annotation.body.type}` +
          ")"
        );
      default:
        return annotation.body.type;
    }
  },
};
