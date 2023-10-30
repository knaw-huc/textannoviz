import logo from "../../../assets/logo-republic-temp.png";
import {ProjectConfig} from "../../../model/ProjectConfig";
import {AnnotationButtons} from "../AnnotationButtons.tsx";
import {AnnotationItemContent} from "../AnnotationItemContent.tsx";
import {AnnotationLinks} from "../AnnotationLinks.tsx";
import {Help} from "../Help.tsx";
import {MetadataPanel} from "../MetadataPanel.tsx";
import {SearchInfoPage} from "../SearchInfoPage.tsx";
import AnnotationItem from "../AnnotationItem.tsx";
import {defaultConfig} from "../../default/config";
import {englishRepublicLabels} from "./englishRepublicLabels.ts";
import {dutchRepublicLabels} from "./dutchRepublicLabels.ts";

export const republicConfig: ProjectConfig = Object.assign({}, defaultConfig, {
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
    "Attendant",
    "Resolution",
    // "Reviewed",
    "Session",
    // "TextRegion",
    "Scan",
  ],
  tier: ["volumes", "openings"],
  bodyType: ["Session", "Resolution", "Attendant"],
  scanAnnotation: "Scan",
  elasticIndexName: "resolutions",
  initialDateFrom: "1705-01-01",
  initialDateTo: "1795-12-31",
  annotationTypesToZoom: ["resolution", "attendance_list"],
  logoImageUrl: logo,
  headerTitle: "REPUBLIC",
  logoHref: "https://republic.huygens.knaw.nl/",
  components: {
    AnnotationItem,
    AnnotationItemContent,
    AnnotationLinks,
    AnnotationButtons,
    Help,
    MetadataPanel,
    SearchInfoPage
  },
  selectedLanguage: 'nl',
  languages: [
    {code: 'nl', labels: dutchRepublicLabels},
    {code: 'en', labels: englishRepublicLabels}
  ],
  mirador: {
    showTopMenuButton: true,
  },
});
