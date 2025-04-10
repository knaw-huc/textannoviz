import merge from "lodash/merge";
import logo from "../../../assets/logo-republic-temp.png";
import {
  ProjectConfig,
  ProjectSpecificConfig,
} from "../../../model/ProjectConfig";
import { defaultConfig } from "../../default/config";
import {
  getHighlightCategory,
  projectHighlightedTypes,
} from "../annotation/ProjectAnnotationModel";
import { AnnotationButtons } from "../AnnotationButtons";
import { MetadataPanel } from "../MetadataPanel";
import "../project.css";
import { SearchItem } from "../SearchItem";
import { dutchTranslatinLabels } from "./dutchTranslatinLabels";

export const translatinConfig: ProjectConfig = merge({}, defaultConfig, {
  id: "translatin",
  relativeTo: "tei:Drama",
  broccoliUrl: "https://broccoli.translatin.huygens.knaw.nl",
  annotationTypesToInclude: [
    // "tei:Author",
    // "tei:Bibl",
    // "tei:Body",
    // "tei:Date",
    "tei:Div",
    "tei:Drama",
    // "tei:Editor",
    // "tei:Emph",
    // "tei:FileDesc",
    "tei:Head",
    "tei:Hi",
    // "tei:Item",
    // "tei:Keywords",
    // "tei:Lb",
    // "tei:List",
    // "tei:Milestone",
    // "tei:Name",
    // "tei:Note",
    // "tei:P",
    // "tei:Part",
    // "tei:ProfileDesc",
    // "tei:Ptr",
    // "tei:PubPlace",
    // "tei:PublicationStmt",
    // "tei:Publisher",
    // "tei:Quote",
    "tei:Ref",
    // "tei:Resp",
    // "tei:RespStmt",
    // "tei:SourceDesc",
    // "tei:TeiHeader",
    // "tei:Term",
    // "tei:Text",
    // "tei:TextClass",
    // "tei:Title",
    // "tei:TitleStmt",
  ],
  // elasticIndexName: "translatin-0.0.2-016",
  elasticIndexName: "translatin-0.0.2-016-drama",
  initialDateFrom: "1500-01-01",
  initialDateTo: "1800-01-01",
  initialRangeFrom: "0",
  initialRangeTo: "30000",
  maxRange: 30000,
  logoImageUrl: logo,
  headerColor: "bg-brand1-100 text-brand1-800",
  headerTitle: "TRANSLATIN",
  showSearchResultsButtonFooter: false,
  showMirador: false,
  showAnnotations: true,
  components: {
    MetadataPanel,
    SearchItem,
    AnnotationButtons,
  },
  highlightedAnnotationTypes: projectHighlightedTypes,

  getHighlightCategory: getHighlightCategory,

  selectedLanguage: "nl",
  languages: [{ code: "nl", labels: dutchTranslatinLabels }],
  defaultKeywordAggsToRender: [
    "author",
    "firstEdition",
    "genre",
    "pubYear",
    "pubPlace",
    "publisher",
    "titleExpanded",
  ],
} as ProjectSpecificConfig);
