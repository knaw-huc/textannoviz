import merge from "lodash/merge";

import logo from "../../../assets/logo-goetgevonden.png";
import {
  ProjectConfig,
  ProjectSpecificConfig,
} from "../../../model/ProjectConfig";
import { defaultConfig } from "../../default/config";
import { EntitySummary } from "../annotation/EntitySummary.tsx";
import {
  getAnnotationCategory,
  isEntity,
  projectEntityTypes,
} from "../annotation/ProjectAnnotationModel.ts";
import { AnnotationButtons } from "../AnnotationButtons.tsx";
import { HelpLink } from "../HelpLink.tsx";
import { MetadataPanel } from "../MetadataPanel.tsx";
import { SearchInfoPage } from "../SearchInfoPage.tsx";
import { SearchItem } from "../SearchItem.tsx";
import { dutchRepublicLabels } from "./dutchRepublicLabels.ts";

export const republicConfig: ProjectConfig = merge({}, defaultConfig, {
  id: "republic",
  broccoliUrl: "https://api.goetgevonden.nl",
  // broccoliUrl: "https://broccoli.tt.di.huc.knaw.nl",
  // broccoliUrl: "https://broccoli.republic-caf.diginfra.org",
  colours: {
    resolution: "yellow",
    attendant: "#DB4437",
    reviewed: "cyan",
    attendancelist: "yellow",
    textregion: "blue",
  },
  relativeTo: "Page",
  annotationTypesToInclude: [
    // "Paragraph",
    "Resolution",
    "Session",
    "Entity",
    "Page",
    "DateOccurrence",
  ],

  showAnnotations: true,
  annotationTypesToHighlight: [],
  entityAnnotationTypes: projectEntityTypes,
  getAnnotationCategory: getAnnotationCategory,
  isEntity: isEntity,

  pageAnnotation: "Page",
  showPrevNextScanButtons: true,
  elasticIndexName: "republic-2024.11.30",
  initialDateFrom: "1576-08-04",
  initialDateTo: "1796-03-01",
  initialRangeFrom: "0",
  initialRangeTo: "66000",
  maxRange: 66000,
  logoImageUrl: logo,
  headerColor: "bg-brand1-950 text-brand1-400",
  headerTitle: "",
  logoHref: "https://goetgevonden.nl",
  histogramFacet: "sessionYear",
  showHistogram: true,
  showSliderFacets: true,
  showSettingsMenuFooter: false,
  useExternalConfig: true,
  visualizeAnnosMirador: true,
  zoomAnnoMirador: true,
  showMiradorNavigationButtons: false,
  overrideDefaultAggs: [
    {
      facetName: "sessionYear",
      order: "countDesc",
      size: 250,
    },
    {
      facetName: "delegateName",
      order: "keyAsc",
      size: 9999,
    },
    {
      facetName: "commissionName",
      order: "keyAsc",
      size: 9999,
    },
    {
      facetName: "locationName",
      order: "keyAsc",
      size: 9999,
    },
    {
      facetName: "organisationName",
      order: "keyAsc",
      size: 9999,
    },
    {
      facetName: "personName",
      order: "keyAsc",
      size: 9999,
    },
    {
      facetName: "roleName",
      order: "keyAsc",
      size: 9999,
    },
  ],
  defaultKeywordAggsToRender: [
    "propositionType",
    "resolutionType",
    "delegateName",
    "commissionName",
    "locationName",
    "organisationName",
    "personName",
    "roleName",
  ],
  showFacetFilter: true,
  showWebAnnoTab: false,
  components: {
    EntitySummary,
    MetadataPanel,
    SearchItem,
    AnnotationButtons,
    HelpLink,
    SearchInfoPage,
  },
  selectedLanguage: "nl",
  languages: [
    { code: "nl", labels: dutchRepublicLabels },
    // { code: "en", labels: englishRepublicLabels },
  ],
  mirador: {
    showTopMenuButton: true,
    showWindowSideBar: true,
  },
} as ProjectSpecificConfig);
