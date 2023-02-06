import React from "react";
import { AnnoRepoAnnotation } from "../../../../model/AnnoRepoAnnotation";
import { ProjectConfig } from "../../../../model/ProjectConfig";
import { getAnnotationItem } from "../getAnnotationItem";
import { GetAnnotationItemContent } from "../GetAnnotationItemContent";

export const globaliseConfig: ProjectConfig = {
  id: "globalise",

  colours: {
    textregion: "white",
    textline: "#DB4437",
    entity: "green",
  },

  relativeTo: "px:Page",
  annotationTypesToInclude: [
    "px:TextRegion, px:TextLine, tt:Paragraph, tt:Entity, px:Page",
  ],
  broccoliVersion: "v0",
  tier: ["documents", "openings"],
  bodyType: ["px:TextLine", "px:TextRegion", "tt:Paragraph", "tt:Entity"],

  renderAnnotationItem: (annotation: AnnoRepoAnnotation) =>
    getAnnotationItem(annotation),

  renderAnnotationItemContent: (annotation: AnnoRepoAnnotation) => {
    return <GetAnnotationItemContent annotation={annotation} />;
  },
};
