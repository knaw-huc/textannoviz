import React from "react";
import { AnnoRepoAnnotation } from "../../../../model/AnnoRepoAnnotation";
import { ProjectConfig } from "../../../../model/ProjectConfig";
import { selectDistinctBodyTypes } from "../../../../utils/broccoli";
import { createIndices } from "../../../../utils/createIndices";
import { GetAnnotationButtons } from "../GetAnnotationButtons";
import { GetAnnotationItemContent } from "../GetAnnotationItemContent";
import { GetHome } from "../GetHome";
import { RenderMetadataPanel } from "../RenderMetadataPanel";
import { getAnnotationItem } from "../getAnnotationItem";

export const globaliseConfig: ProjectConfig = {
  id: "globalise",

  colours: {
    textregion: "white",
    textline: "#DB4437",
    entity: "green",
  },

  relativeTo: "px:Page",
  annotationTypes: await selectDistinctBodyTypes("globalise"),
  annotationTypesToInclude: [
    "px:Page",
    "px:TextLine",
    "px:TextRegion",
    "tt:Entity",
    "tt:Paragraph",
    "Document",
  ],
  tier: ["documents", "openings"],
  bodyType: ["px:TextLine", "px:TextRegion", "tt:Paragraph", "tt:Entity"],
  scanAnnotation: "px:Page",
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
  elasticIndexName: "docs",
  searchFacetTitles: {
    bodyType: "Body type",
    className: "Class name",
    classDescription: "Class description",
  },
  textPanelTitles: {
    self: "Full text",
  },
  allPossibleTextPanels: ["self"],
  defaultTextPanels: ["self"],

  renderAnnotationItem: (annotation: AnnoRepoAnnotation) =>
    getAnnotationItem(annotation),

  renderAnnotationItemContent: (annotation: AnnoRepoAnnotation) => {
    return <GetAnnotationItemContent annotation={annotation} />;
  },

  renderAnnotationButtons: () => {
    return <GetAnnotationButtons />;
  },

  renderMetadataPanel: (annotations: AnnoRepoAnnotation[]) => {
    return <RenderMetadataPanel annotations={annotations} />;
  },

  createRouter: (
    comp1: React.ReactNode,
    comp2: React.ReactNode,
    comp3: React.ReactNode,
    errorComp: React.ReactNode,
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
      {
        path: "search",
        element: comp3,
        errorElement: errorComp,
      },
    ];
  },

  renderHome: () => {
    return <GetHome />;
  },
};
