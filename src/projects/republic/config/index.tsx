import React from "react";
import logo from "../../../assets/logo-republic-temp.png";
import { ProjectConfig } from "../../../model/ProjectConfig";
import { dutchLabels } from "../../default/config/dutchLabels.ts";
import { AnnotationButtons } from "../AnnotationButtons.tsx";
import { AnnotationItemContent } from "../AnnotationItemContent.tsx";
import { AnnotationLinks } from "../AnnotationLinks.tsx";
import { Help } from "../Help.tsx";
import { MetadataPanel } from "../MetadataPanel.tsx";
import { SearchInfoPage } from "../SearchInfoPage.tsx";
import AnnotationItem from "../AnnotationItem.tsx";

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
  initialDateTo: "1795-12-31",
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
    Dominica: "Zondag",
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
  showSearchQueryHistory: true,
  showDateFacets: true,
  showKeywordFacets: true,
  showSelectedFilters: true,

  components: {
    AnnotationItem,
    AnnotationItemContent,
    AnnotationLinks,
    AnnotationButtons,
    Help,
    MetadataPanel,
    SearchInfoPage
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
  labels: dutchLabels,
  mirador: {
    showWindowSideBar: false,
    showTopMenuButton: true,
  },
};
