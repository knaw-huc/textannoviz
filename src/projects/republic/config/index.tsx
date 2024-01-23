import * as _ from "lodash";
import logo from "../../../assets/logo-republic-temp.png";
import { ProjectConfig } from "../../../model/ProjectConfig";
import { defaultConfig } from "../../default/config";
import { AnnotationButtons } from "../AnnotationButtons.tsx";
import AnnotationItem from "../AnnotationItem.tsx";
import { AnnotationItemContent } from "../AnnotationItemContent.tsx";
import { Help } from "../Help.tsx";
import { MetadataPanel } from "../MetadataPanel.tsx";
import { SearchItem } from "../SearchItem.tsx";
import { dutchRepublicLabels } from "./dutchRepublicLabels.ts";
import { englishRepublicLabels } from "./englishRepublicLabels.ts";

export const republicConfig: ProjectConfig = _.merge({}, defaultConfig, {
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
    // "RepublicParagraph",
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
  tier: ["volumes", "openings"],
  bodyType: ["Session", "Resolution", "Attendant"],
  scanAnnotation: "Scan",
  elasticIndexName: "paras",
  initialDateFrom: "1705-01-01",
  initialDateTo: "1795-12-31",
  annotationTypesToZoom: ["resolution", "attendance_list"],
  logoImageUrl: logo,
  headerTitle: "REPUBLIC",
  logoHref: "https://republic.huygens.knaw.nl/",
  histogramFacet: "sessionYear",
  showHistogram: true,
  components: {
    AnnotationItem,
    AnnotationItemContent,
    AnnotationButtons,
    Help,
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
