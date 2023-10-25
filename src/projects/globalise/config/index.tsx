import React from "react";
import logo from "../../../assets/G-1.png";
import { englishLabels } from "../../default/config/englishLabels.ts";
import { AnnotationButtons } from "../AnnotationButtons.tsx";
import { AnnotationItemContent } from "../AnnotationItemContent.tsx";
import { Help } from "../Help.tsx";
import { MetadataPanel } from "../MetadataPanel.tsx";
import { SearchInfoPage } from "../SearchInfoPage.tsx";
import AnnotationItem from "../AnnotationItem.tsx";
import {ProjectConfig} from "../../../model/ProjectConfig.ts";

export const globaliseConfig: ProjectConfig = {
  id: "globalise",
  broccoliUrl: "https://gloccoli.tt.di.huc.knaw.nl",

  colours: {
    textregion: "white",
    textline: "#DB4437",
    entity: "green",
  },

  relativeTo: "na:File",
  annotationTypesToZoom: [],
  annotationTypesToInclude: ["px:Page"],
  tier: [],
  bodyType: [],
  scanAnnotation: "na:File",
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
  initialDateFrom: "1500-01-01",
  initialDateTo: "1800-01-01",
  showSearchSortBy: false,
  showFacsimileButtonFooter: false,
  showSearchResultsButtonFooter: false,
  defaultShowMetadataPanel: false,
  showToggleTextPanels: false,
  zoomAnnoMirador: false,
  logoImageUrl: logo,
  headerTitle: "GLOBALISE Transcriptions Viewer",
  logoHref: "https://globalise.huygens.knaw.nl",
  showSearchQueryHistory: false,
  showDateFacets: false,
  showKeywordFacets: false,
  showSelectedFilters: false,
  components: {
    AnnotationButtons,
    AnnotationItem,
    AnnotationItemContent,
    Help,
    MetadataPanel,
    SearchInfoPage,
    AnnotationLinks: () => null
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
  labels: englishLabels,
  mirador: {
    showWindowSideBar: true,
    showTopMenuButton: false
  },
};
