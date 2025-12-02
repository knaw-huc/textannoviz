import merge from "lodash/merge";
import logo from "../../../assets/logo-huygens.png";
import {
  ProjectConfig,
  ProjectSpecificConfig,
} from "../../../model/ProjectConfig";
import { defaultConfig } from "../../default/config";
import { SearchItem } from "../SearchItem";
import { dutchBC1900Labels } from "./dutchBC1900Labels";
import { MetadataPanel } from "../MetadataPanel";
import { projectPageMarkerAnnotationTypes } from "../annotation/ProjectAnnotationModel";
import { SearchInfoPage } from "../SearchInfoPage";

export const bc1900Config: ProjectConfig = merge({}, defaultConfig, {
  id: "bc1900",
  broccoliUrl: "http://localhost:8082",
  relativeTo: "Letter",
  annotationTypesToInclude: [
    "Dataset",
    "Division",
    "Letter",
    // "Line",
    "Page",
    // "Word",
  ],
  components: {
    SearchItem,
    MetadataPanel,
    SearchInfoPage,
  },
  pageMarkerAnnotationTypes: projectPageMarkerAnnotationTypes,
  elasticIndexName: "bc1900",
  showAnnotations: true,
  initialDateFrom: "1860-01-01",
  initialDateTo: "1938-01-01",
  initialRangeFrom: "0",
  initialRangeTo: "30000",
  maxRange: 30000,
  logoImageUrl: logo,
  headerColor: "bg-brand1-100 text-brand1-800",
  headerTitle: "Brieven en Correspondenten rond 1900",
  showSearchResultsButtonFooter: false,
  showMirador: false,
  useExternalConfig: true,
  showSearchResultsOnInfoPage: true,
  // overrideDefaultSearchParams: {
  //   sortBy: "dateSent",
  //   sortOrder: "asc",
  // },
  defaultKeywordAggsToRender: ["sender", "recipient", "fromLocation"],
  viewsToSearchIn: ["letterText"],
  selectedLanguage: "nl",
  languages: [{ code: "nl", labels: dutchBC1900Labels }],
} as ProjectSpecificConfig);
