import merge from "lodash/merge";
import logo from "../../../assets/logo-republic-temp.png";
import { ProjectConfig } from "../../../model/ProjectConfig";
import { defaultConfig } from "../../default/config";
import { MetadataPanel } from "../MetadataPanel.tsx";
import { SearchItem } from "../SearchItem.tsx";
import { dutchRepublicLabels } from "./dutchRepublicLabels.ts";
import { englishRepublicLabels } from "./englishRepublicLabels.ts";

export const republicConfig: ProjectConfig = merge({}, defaultConfig, {
  id: "republic",
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
    "RepublicParagraph",
    "Attendant",
    "Resolution",
    "Reviewed",
    "Session",
    // "TextRegion",
    "Scan",
  ],
  annotationTypesToHighlight: ["Attendant"],
  allowedAnnotationTypesToHighlight: [
    "AttendanceList",
    "Attendant",
    "Resolution",
    "Reviewed",
  ],
  elasticIndexName: "republic-2024.01.19-wc",
  initialDateFrom: "1588-01-01",
  initialDateTo: "1796-12-31",
  initialRangeFrom: "0",
  initialRangeTo: "3000",
  maxRange: 3000,
  logoImageUrl: logo,
  headerTitle: "REPUBLIC",
  logoHref: "https://republic.huygens.knaw.nl/",
  histogramFacet: "sessionYear",
  showHistogram: true,
  showSliderFacets: true,
  showSettingsMenuFooter: true,
  useExternalConfig: true,
  visualizeAnnosMirador: true,
  zoomAnnoMirador: true,
  showMiradorNavigationButtons: true,
  components: {
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
