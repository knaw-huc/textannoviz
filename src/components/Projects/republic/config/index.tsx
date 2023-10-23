import React from "react";
import logo from "../../../../assets/logo-republic-temp.png";
import { AnnoRepoAnnotation } from "../../../../model/AnnoRepoAnnotation";
import { ProjectConfig } from "../../../../model/ProjectConfig";
import { dutchLabels } from "../../default/config/dutchLabels.ts";
import { GetAnnotationButtons } from "../GetAnnotationButtons";
import { GetAnnotationItemContent } from "../GetAnnotationItemContent";
import { GetAnnotationLinks } from "../GetAnnotationLinks";
import { GetHelp } from "../GetHelp.tsx";
import { RenderMetadataPanel } from "../RenderMetadataPanel";
import { getAnnotationItem } from "../getAnnotationItem";

export const republicConfig: ProjectConfig = {
  id: "republic",
  broccoliUrl: "https://broccoli.tt.di.huc.knaw.nl",

  colours: {
    resolution: "green",
    attendant: "#DB4437",
    reviewed: "cyan",
    attendancelist: "yellow",
    textregion: "blue",
  },

  relativeTo: "Scan",
  annotationTypesToInclude: [
    "AttendanceList",
    "Attendant",
    "Resolution",
    // "Reviewed",
    "Session",
    // "TextRegion",
    "Scan",
  ],
  annotationTypesTitles: {
    AttendanceList: "Attendance list",
    Attendant: "Attendant",
    Line: "Line",
    Page: "Page",
    RepublicParagraph: "Paragraph",
    Resolution: "Resolution",
    Reviewed: "Reviewed",
    Scan: "Scan",
    Session: "Session",
    TextRegion: "Text region",
    Volume: "Volume",
  },
  tier: ["volumes", "openings"],
  bodyType: ["Session", "Resolution", "Attendant"],
  scanAnnotation: "Scan",
  elasticIndexName: "resolutions",
  initialDateFrom: "1705-01-01",
  initialDateTo: "1799-12-31",
  searchFacetTitles: {
    sessionDate: "Date",
    sessionWeekday: "Weekdag",
    bodyType: "Type",
    propositionType: "Propositie type",
  },
  textPanelTitles: {
    self: "Tekst",
  },
  allPossibleTextPanels: ["self"],
  defaultTextPanels: ["self"],
  facetsTranslation: {
    Lunæ: "Maandag",
    Martis: "Dinsdag",
    Mercurii: "Woensdag",
    Jovis: "Donderdag",
    Veneris: "Vrijdag",
    Sabbathi: "Zaterdag",
    Resolution: "Resolutie",
    AttendanceList: "Presentielijst",
  },
  showSearchSortBy: true,
  showFacsimileButtonFooter: true,
  showSearchResultsButtonFooter: true,
  defaultShowMetadataPanel: true,
  showToggleTextPanels: false,
  zoomAnnoMirador: true,
  annotationTypesToZoom: ["resolution", "attendance_list"],
  logoImageUrl: logo,
  headerTitle: "REPUBLIC",
  logoHref: "https://republic.huygens.knaw.nl/",

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
        element: comp3,
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
        path: "help",
        element: comp1,
        errorElement: errorComp,
      },
    ];
  },

  renderHelp: () => {
    return <GetHelp />;
  },
  labels: dutchLabels,
  mirador: {
    showWindowSideBar: false,
    showTopMenuButton: true
  },
};
