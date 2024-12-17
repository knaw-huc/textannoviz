import merge from "lodash/merge";
import logo from "../../../assets/logo-republic-temp.png";
import { ProjectConfig } from "../../../model/ProjectConfig";
import { defaultConfig } from "../../default/config";

export const hooftConfig: ProjectConfig = merge({}, defaultConfig, {
  id: "hooft",
  relativeTo: "File",
  //Possible: ["Dataset","File","Letter"]
  annotationTypesToInclude: ["Letter", "File"],
  // annotationTypesToHighlight: ["Dataset"],
  elasticIndexName: "letters-2024-03-28",
  initialDateFrom: "1500-01-01",
  initialDateTo: "1800-01-01",
  initialRangeFrom: "0",
  initialRangeTo: "30000",
  maxRange: 30000,
  logoImageUrl: logo,
  headerColor: "bg-brand1-100 text-brand1-800",
  headerTitle: "Brieven van Hooft",
  showSearchResultsButtonFooter: false,
  showMirador: false,
  useExternalConfig: true,
  defaultKeywordAggsToRender: ["bodyType"],
});
