import merge from "lodash/merge";
import logo from "../../../assets/logo-goetgevonden.png";
import { ProjectConfig } from "../../../model/ProjectConfig";
import { defaultConfig } from "../../default/config";
import { MetadataPanel } from "../MetadataPanel.tsx";
import { SearchItem } from "../SearchItem.tsx";
import { dutchRepublicLabels } from "./dutchRepublicLabels.ts";
import { englishRepublicLabels } from "./englishRepublicLabels.ts";
import { EntitySummaryDetails } from "../EntitySummaryDetails.tsx";

export const republicConfig: ProjectConfig = merge({}, defaultConfig, {
  id: "republic",
  broccoliUrl: "https://broccoli.tt.di.huc.knaw.nl",
  // broccoliUrl: "https://broccoli.republic-caf.diginfra.org",
  colours: {
    resolution: "green",
    attendant: "#DB4437",
    reviewed: "cyan",
    attendancelist: "yellow",
    textregion: "blue",
  },
  relativeTo: "Page",
  annotationTypesToInclude: [
    "AttendanceList",
    "RepublicParagraph",
    "Attendant",
    "Resolution",
    "Reviewed",
    "Session",
    "Entity",
    // "TextRegion",
    "Page",
  ],
  showAnnotations: true,
  annotationTypesToHighlight: ["Entity"],
  allowedAnnotationTypesToHighlight: ["Entity"],
  entityAnnotationTypes: ["Entity"],
  entityCategoryPath: "metadata.category",

  pageAnnotation: "Page",
  showPrevNextScanButtons: true,
  // elasticIndexName: "republic-2024.06.18",
  elasticIndexName: "republic-2024.07.18",
  initialDateFrom: "1576-01-01",
  initialDateTo: "1796-12-31",
  initialRangeFrom: "0",
  initialRangeTo: "66000",
  maxRange: 66000,
  logoImageUrl: logo,
  headerColor: "bg-brand1-950 text-brand1-400",
  headerTitle: "",
  logoHref: "https://republic.huygens.knaw.nl/",
  histogramFacet: "sessionYear",
  showHistogram: true,
  showSliderFacets: true,
  showSettingsMenuFooter: true,
  useExternalConfig: true,
  visualizeAnnosMirador: true,
  zoomAnnoMirador: true,
  showMiradorNavigationButtons: true,
  overrideDefaultAggs: [
    {
      facetName: "sessionYear",
      order: "countDesc",
      size: 250,
    },
  ],
  defaultKeywordAggsToRender: [
    "propositionType",
    "textType",
    "resolutionType",
    "delegateName",
    "entityName",
  ],
  showFacetFilter: true,
  components: {
    EntitySummaryDetails,
    MetadataPanel,
    SearchItem,
  },
  selectedLanguage: "nl",
  languages: [
    { code: "nl", labels: dutchRepublicLabels },
    { code: "en", labels: englishRepublicLabels },
  ],
  mirador: {
    showTopMenuButton: true,
    showWindowSideBar: true,
  },
});
