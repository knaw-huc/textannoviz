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
};
