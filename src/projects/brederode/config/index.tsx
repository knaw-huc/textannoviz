import merge from "lodash/merge";
import logo from "../../../assets/logo-republic-temp.png";
import {
  ProjectConfig,
  ProjectSpecificConfig,
} from "../../../model/ProjectConfig";
import { defaultConfig } from "../../default/config";
import { SearchItem } from "../SearchItem";
import { englishBrederodeLabels } from "./englishBrederodeLabels";
import { MetadataPanel } from "../MetadataPanel";

export const brederodeConfig: ProjectConfig = merge({}, defaultConfig, {
  id: "brederode",
  broccoliUrl: "http://localhost:8082",
  relativeTo: "Letter",
  annotationTypesToInclude: [
    "Dataset",
    "Division",
    "Letter",
    "Line",
    "Page",
    "Word",
  ],
  components: {
    SearchItem,
    MetadataPanel,
  },
  elasticIndexName: "brederode",
  showAnnotations: true,
  initialDateFrom: "1602-01-01",
  initialDateTo: "1638-01-01",
  initialRangeFrom: "0",
  initialRangeTo: "30000",
  maxRange: 30000,
  logoImageUrl: logo,
  headerColor: "bg-brand1-100 text-brand1-800",
  headerTitle: "Brederode",
  showSearchResultsButtonFooter: false,
  showMirador: false,
  useExternalConfig: true,
  defaultKeywordAggsToRender: [
    "sender",
    "recipient",
    "fromLocation",
    "toLocation",
  ],
  viewsToSearchIn: ["letterText"],
  selectedLanguage: "en",
  languages: [{ code: "en", labels: englishBrederodeLabels }],
} as ProjectSpecificConfig);
