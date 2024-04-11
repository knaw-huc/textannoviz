import merge from "lodash/merge";
import logo from "../../../assets/logo-republic-temp.png";
import { ProjectConfig } from "../../../model/ProjectConfig";
import { defaultConfig } from "../../default/config";
import { MetadataPanel } from "../MetadataPanel";
import { SearchItem } from "../SearchItem";
import { dutchTranslatinLabels } from "./dutchTranslatinLabels";

export const translatinConfig: ProjectConfig = merge({}, defaultConfig, {
  id: "translatin",
  relativeTo: "tl:Manifestation",
  annotationTypesToInclude: [
    // "pagexml:Line",
    // "pagexml:Page",
    // "pagexml:Region",
    "tl:Manifestation",
  ],
  elasticIndexName: "manifestations",
  initialDateFrom: "1500-01-01",
  initialDateTo: "1800-01-01",
  logoImageUrl: logo,
  headerTitle: "TRANSLATIN",
  showSearchResultsButtonFooter: false,

  components: {
    MetadataPanel,
    SearchItem,
  },

  selectedLanguage: "nl",
  languages: [{ code: "nl", labels: dutchTranslatinLabels }],
});
