import React from "react";
import { createIndices } from "../../../../backend/utils/createIndices";
import { AnnoRepoAnnotation } from "../../../../model/AnnoRepoAnnotation";
import { ProjectConfig } from "../../../../model/ProjectConfig";
import { GetAnnotationButtons } from "../GetAnnotationButtons";
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
    "px:TextRegion",
    "px:TextLine",
    "tt:Paragraph",
    "tt:Entity",
    "px:Page",
  ],
  broccoliVersion: "v0",
  tier: ["documents", "openings"],
  bodyType: ["px:TextLine", "px:TextRegion", "tt:Paragraph", "tt:Entity"],
  documents: [
    {
      docNr: "43",
      index: createIndices(17, 21),
    },
    {
      docNr: "199",
      index: createIndices(19, 57),
    },
    {
      docNr: "316_1",
      index: createIndices(19, 21),
    },
    {
      docNr: "316_2",
      index: createIndices(48, 49),
    },
    {
      docNr: "316_3",
      index: createIndices(52, 56),
    },
    {
      docNr: "405",
      index: createIndices(115, 135),
    },
    {
      docNr: "685_1",
      index: createIndices(77, 78),
    },
    {
      docNr: "685_2",
      index: createIndices(183, 190),
    },
  ],

  renderAnnotationItem: (annotation: AnnoRepoAnnotation) =>
    getAnnotationItem(annotation),

  renderAnnotationItemContent: (annotation: AnnoRepoAnnotation) => {
    return <GetAnnotationItemContent annotation={annotation} />;
  },

  renderAnnotationButtons: () => {
    return <GetAnnotationButtons />;
  },
};
