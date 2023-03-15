import React from "react";
import { AnnoRepoAnnotation } from "../../../../model/AnnoRepoAnnotation";
import { ProjectConfig } from "../../../../model/ProjectConfig";
import { GetAnnotationButtons } from "../GetAnnotationButtons";
import { getAnnotationItem } from "../getAnnotationItem";
import { GetAnnotationItemContent } from "../GetAnnotationItemContent";
import { GetAnnotationLinks } from "../GetAnnotationLinks";
import { GetHome } from "../GetHome";

export const republicConfig: ProjectConfig = {
  id: "republic",

  colours: {
    resolution: "green",
    attendant: "#DB4437",
    reviewed: "cyan",
    attendancelist: "yellow",
    textregion: "blue",
  },

  relativeTo: "Scan",
  annotationTypes: [
    "AttendanceList",
    "Attendant",
    "Line",
    "Page",
    "RepublicParagraph",
    "Resolution",
    "Reviewed",
    "Scan",
    "Session",
    "TextRegion",
  ],
  annotationTypesToInclude: [
    "AttendanceList",
    "Attendant",
    "Resolution",
    "Reviewed",
    "Session",
    "TextRegion",
  ],
  tier: ["volumes", "openings"],
  bodyType: ["Session", "Resolution", "Attendant"],
  scanAnnotation: "Scan",

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

  createRouter: (
    comp1: React.ReactNode,
    comp2: React.ReactNode,
    errorComp: React.ReactNode
  ) => {
    return [
      {
        path: "/",
        element: comp1,
        errorElement: errorComp,
      },
      {
        path: "detail/:tier0/:tier1",
        element: comp2,
        errorElement: errorComp,
      },
      {
        path: "detail/:tier2",
        element: comp2,
        errorElement: errorComp,
      },
    ];
  },

  renderHome: () => {
    return <GetHome />;
  },
};
