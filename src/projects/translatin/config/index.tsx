import * as _ from "lodash";
import logo from "../../../assets/logo-republic-temp.png";
import { ProjectConfig } from "../../../model/ProjectConfig";
import { defaultConfig } from "../../default/config";
import { AnnotationButtons } from "../AnnotationButtons";
import { AnnotationItem } from "../AnnotationItem";
import { AnnotationItemContent } from "../AnnotationItemContent";
import { MetadataPanel } from "../MetadataPanel";
import { SearchItem } from "../SearchItem";
import { dutchTranslatinLabels } from "./dutchTranslatinLabels";

export const translatinConfig: ProjectConfig = _.merge({}, defaultConfig, {
  id: "translatin",
  relativeTo: "tl:Manifestation",
  annotationTypesToInclude: [
    // "pagexml:Line",
    // "pagexml:Page",
    // "pagexml:Region",
    "tl:Manifestation",
  ],
  tier: ["tl:Manifestation"],
  scanAnnotation: "tl:Manifestation",
  elasticIndexName: "manifestations",
  initialDateFrom: "1500-01-01",
  initialDateTo: "1800-01-01",
  logoImageUrl: logo,
  headerTitle: "TRANSLATIN",
  zoomAnnoMirador: false,
  showSearchResultsButtonFooter: false,

  components: {
    AnnotationButtons,
    AnnotationItem,
    AnnotationItemContent,
    MetadataPanel,
    SearchItem,
  },

  selectedLanguage: "nl",
  languages: [{ code: "nl", labels: dutchTranslatinLabels }],
});