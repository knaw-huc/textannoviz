import React from "react";
import { AnnoRepoAnnotation } from "../../../../model/AnnoRepoAnnotation";
import { ProjectConfig } from "../../../../model/ProjectConfig";
import { GetAnnotationButtons } from "../GetAnnotationButtons";
import { getAnnotationItem } from "../getAnnotationItem";
import { GetAnnotationItemContent } from "../GetAnnotationItemContent";
import { GetAnnotationLinks } from "../GetAnnotationLinks";

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
    "Session",
    "Resolution",
    "Reviewed",
    "AttendanceList",
    "Attendant",
  ],
  broccoliVersion: "v3",
  tier: ["volumes", "openings"],
  bodyType: ["Session", "Resolution", "Attendant"],
  routerPath: {
    tier0: "detail/volumes/:volumeNum/openings/:openingNum",
    tier1: "detail/resolutions/:resolutionId",
  },

  renderAnnotationItem: (annotation: AnnoRepoAnnotation) =>
    getAnnotationItem(annotation),

  renderAnnotationItemContent: (annotation: AnnoRepoAnnotation) => {
    return <GetAnnotationItemContent annotation={annotation} />;
  },

  renderAnnotationLinks: () => {
    return <GetAnnotationLinks />;
  },

  renderAnnotationButtons: () => {
    return <GetAnnotationButtons />;
  },
};
