import merge from "lodash/merge";
import logo from "../../../assets/logo-republic-temp.png";
import { ProjectConfig } from "../../../model/ProjectConfig";
import { defaultConfig } from "../../default/config";
import { AnnotationButtons } from "../AnnotationButtons";
import { EntitySummaryDetails } from "../EntitySummaryDetails.tsx";
import { MetadataPanel } from "../MetadataPanel";
import { SearchItem } from "../SearchItem";
import { englishSurianoLabels } from "./englishSurianoLabels";

export const surianoConfig: ProjectConfig = merge({}, defaultConfig, {
  id: "suriano",
  relativeTo: "tf:File",
  annotationTypesToInclude: [
    // "EntityMetadata",
    // "tei:Author",
    // "tei:Bibl",
    // "tei:BiblScope",
    // "tei:Body",
    // "tei:Cell",
    // "tei:Collection",
    // "tei:CorrespAction",
    // "tei:CorrespDesc",
    // "tei:Date",
    // "tei:Editor",
    // "tei:FileDesc",
    // "tei:Head",
    // "tei:Hi",
    // "tei:Idno",
    // "tei:Institution",
    // "tei:MsDesc",
    // "tei:MsIdentifier",
    // "tei:Name",
    // "tei:Num",
    // "tei:P",
    // "tei:ProfileDesc",
    // "tei:PublicationStmt",
    // "tei:Quote",
    // "tei:Resp",
    // "tei:RespStmt",
    // "tei:Row",
    // "tei:Settlement",
    // "tei:SourceDesc",
    // "tei:Table",
    // "tei:TeiHeader",
    // "tei:Text",
    // "tei:Title",
    // "tei:TitleStmt",
    // "tf:Ln",
    "tei:Div",
    "tei:Note",
    "tei:Ptr",
    "tf:Ent",
    "tf:File",
    "tf:Folder",
    "tf:Page",
    "LetterBody",
  ],
  allPossibleTextPanels: [
    "original",
    "appendix",
    "text",
    "secretarial",
    "self",
  ],
  defaultTextPanels: ["self"],

  showAnnotations: true,
  annotationTypesToHighlight: ["tf:Ent"],
  allowedAnnotationTypesToHighlight: ["tf:Ent", "tei:Ptr"],
  footnoteMarkerAnnotationTypes: ["tei:Ptr"],
  pageMarkerAnnotationTypes: ["tf:Page"],
  entityAnnotationTypes: ["tf:Ent"],
  entityCategoryPath: "metadata.kind",

  showPrevNextScanButtons: true,
  pageAnnotation: "tf:Page",
  elasticIndexName: "suriano-0.5.1e-024",
  initialDateFrom: "1600-01-01",
  initialDateTo: "1700-01-01",
  initialRangeFrom: "0",
  initialRangeTo: "30000",
  maxRange: 30000,
  logoImageUrl: logo,
  headerColor: "bg-brand1-100 text-brand1-700",
  headerTitle: "The Correspondence of Christofforo Suriano",
  showSearchResultsButtonFooter: false,
  useExternalConfig: false,
  showToggleTextPanels: true,
  showKeywordFacets: false,
  showFacetFilter: false,
  showMiradorNavigationButtons: false,
  allowCloseTextPanel: true,
  components: {
    EntitySummaryDetails,
    SearchItem,
    MetadataPanel,
    AnnotationButtons,
  },

  selectedLanguage: "en",
  languages: [{ code: "en", labels: englishSurianoLabels }],
});
