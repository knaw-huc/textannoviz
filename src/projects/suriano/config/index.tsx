import * as _ from "lodash";
import logo from "../../../assets/logo-republic-temp.png";
import { ProjectConfig } from "../../../model/ProjectConfig";
import { defaultConfig } from "../../default/config";
import { MetadataPanel } from "../MetadataPanel";
import { SearchItem } from "../SearchItem";
import { englishSurianoLabels } from "./englishSurianoLabels";

export const surianoConfig: ProjectConfig = _.merge({}, defaultConfig, {
  id: "suriano",
  relativeTo: "tf:File",
  annotationTypesToInclude: [
    // "nlp:Sentence",
    // "nlp:Token",
    // "tei:Author",
    // "tei:Bibl",
    // "tei:BiblScope",
    // "tei:Body",
    // "tei:Cell",
    // "tei:Collection",
    // "tei:CorrespAction",
    // "tei:CorrespDesc",
    // "tei:Date",
    // "tei:Div",
    // "tei:Editor",
    "tei:Ent",
    // "tei:FileDesc",
    // "tei:Head",
    // "tei:Hi",
    // "tei:Idno",
    // "tei:Institution",
    // "tei:Lb",
    // "tei:MsDesc",
    // "tei:MsIdentifier",
    // "tei:Name",
    // "tei:Note",
    // "tei:Num",
    // "tei:P",
    // "tei:Pb",
    // "tei:ProfileDesc",
    // "tei:Ptr",
    // "tei:PublicationStmt",
    // "tei:Quote",
    // "tei:Resp",
    // "tei:RespStmt",
    // "tei:Row",
    // "tei:Settlement",
    // "tei:SourceDesc",
    // "tei:Supplied",
    // "tei:Table",
    // "tei:TeiHeader",
    // "tei:Text",
    // "tei:Title",
    // "tei:TitleStmt",
    // "tf:Chunk",
    "tf:File",
    "tf:Folder",
  ],
  allPossibleTextPanels: [
    "original",
    "appendix",
    "text",
    "secretarial",
    "notes",
    "self",
  ],
  defaultTextPanels: ["text"],
  annotationTypesToHighlight: ["tei:Ent"],
  allowedAnnotationTypesToHighlight: ["tei:Ent"],
  elasticIndexName: "letters-0.0.5",
  initialDateFrom: "1600-01-01",
  initialDateTo: "1700-01-01",
  logoImageUrl: logo,
  headerTitle: "The Correspondence of Christofforo Suriano",
  showSearchResultsButtonFooter: false,
  useExternalConfig: true,
  showToggleTextPanels: true,
  showKeywordFacets: false,
  components: {
    SearchItem,
    MetadataPanel,
  },

  selectedLanguage: "en",
  languages: [{ code: "en", labels: englishSurianoLabels }],
});
