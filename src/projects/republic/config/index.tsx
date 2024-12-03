import merge from "lodash/merge";
import logo from "../../../assets/logo-goetgevonden.png";
import { ProjectConfig } from "../../../model/ProjectConfig";
import { defaultConfig } from "../../default/config";
import { EntitySummary } from "../annotation/EntitySummary.tsx";
import {
  getAnnotationCategory,
  isEntity,
  projectEntityTypes,
} from "../annotation/ProjectAnnotationModel.ts";
import { AnnotationButtons } from "../AnnotationButtons.tsx";
import { MetadataPanel } from "../MetadataPanel.tsx";
import { SearchItem } from "../SearchItem.tsx";
import { dutchRepublicLabels } from "./dutchRepublicLabels.ts";
import { HelpLink } from "../HelpLink.tsx";

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
  elasticIndexName: "republic-2024.11.18",
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
  showSettingsMenuFooter: true,
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
      facetName: "attendantName",
      order: "keyAsc",
    },
    {
      facetName: "commissionName",
      order: "keyAsc",
    },
    {
      facetName: "locationName",
      order: "keyAsc",
    },
    {
      facetName: "organisationName",
      order: "keyAsc",
    },
    {
      facetName: "personName",
      order: "keyAsc",
    },
    {
      facetName: "roleName",
      order: "keyAsc",
    },
  ],
  defaultKeywordAggsToRender: [
    "propositionType",
    "resolutionType",
    "attendantName",
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
});
