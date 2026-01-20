import merge from "lodash/merge";
import logo from "../../../assets/logo-republic-temp.png";
import {
  ProjectConfig,
  ProjectSpecificConfig,
} from "../../../model/ProjectConfig";
import { defaultConfig } from "../../default/config";
import { englishLabels } from "./englishLabels";

//RENAME THE VARIABLE!
export const templateConfig: ProjectConfig = merge({}, defaultConfig, {
  id: "REPLACEME",
  relativeTo: "TIER0 anno",
  broccoliUrl: "http://localhost:8082",
  annotationTypesToInclude: [
    "all annotations that should be shown/used in TAV",
  ],
  elasticIndexName: "REPLACEME",
  initialDateFrom: "1500-01-01",
  initialDateTo: "1800-01-01",
  initialRangeFrom: "0",
  initialRangeTo: "30000",
  maxRange: 30000,
  logoImageUrl: logo,
  headerColor: "bg-brand1-100 text-brand1-800",
  headerTitle: "REPLACEME",
  defaultKeywordAggsToRender: [
    "list of facets that should be shown by default",
  ],
  components: {},

  selectedLanguage: "en",
  languages: [{ code: "en", labels: englishLabels }],

  viewsToSearchIn: ["replace with view as defined in Broccoli config/mapping"],
  showSearchInTextViews: false,
  showAnnotations: true,
} as ProjectSpecificConfig);
