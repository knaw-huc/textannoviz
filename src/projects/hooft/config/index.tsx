import * as _ from "lodash";
import logo from "../../../assets/logo-republic-temp.png";
import { ProjectConfig } from "../../../model/ProjectConfig";
import { defaultConfig } from "../../default/config";

export const hooftConfig: ProjectConfig = _.merge({}, defaultConfig, {
  id: "hooft",
  relativeTo: "File",
  //Possible: ["Dataset","File","Letter"]
  annotationTypesToInclude: ["Letter", "File"],
  // annotationTypesToHighlight: ["Dataset"],
  // allowedAnnotationTypesToHighlight: ["Dataset"],
  elasticIndexName: "letters-2024-03-28",
  initialDateFrom: "1500-01-01",
  initialDateTo: "1800-01-01",
  logoImageUrl: logo,
  headerTitle: "Brieven van Hooft",
  showSearchResultsButtonFooter: false,
  showMirador: false,
  useExternalConfig: true,
});
