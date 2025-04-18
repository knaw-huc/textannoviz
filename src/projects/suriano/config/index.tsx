import merge from "lodash/merge";
import logo from "../../../assets/logo-correspondense-of-Suriano.png";
import {
  ProjectConfig,
  ProjectSpecificConfig,
} from "../../../model/ProjectConfig";
import { defaultConfig } from "../../default/config";
import { AnnotationButtons } from "../AnnotationButtons";
import { MetadataPanel } from "../MetadataPanel";
import { SearchItem } from "../SearchItem";
import { englishSurianoLabels } from "./englishSurianoLabels";

import { EntitySummary } from "../annotation/EntitySummary.tsx";
import {
  getAnnotationCategory,
  getHighlightCategory,
  isEntity,
  projectEntityTypes,
  projectHighlightedTypes,
  projectInsertTextMarkerAnnotationTypes,
  projectPageMarkerAnnotationTypes,
  projectTooltipMarkerAnnotationTypes,
} from "../annotation/ProjectAnnotationModel.ts";
import { SearchInfoPage } from "../SearchInfoPage.tsx";
import { Empty } from "../../../components/Empty.tsx";

import projectCss from "../project.css?inline";

export const surianoConfig: ProjectConfig = merge({}, defaultConfig, {
  id: "suriano",
  broccoliUrl: "https://broccoli.suriano.huygens.knaw.nl",
  relativeTo: "tf:File",
  showWebAnnoTab: false,
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
    "tei:Hi",
    "tei:Head",
    "tei:Metamark",
  ],
  showAnnotations: true,
  annotationTypesToHighlight: [],
  entityAnnotationTypes: projectEntityTypes,
  highlightedAnnotationTypes: projectHighlightedTypes,
  tooltipMarkerAnnotationTypes: projectTooltipMarkerAnnotationTypes,
  pageMarkerAnnotationTypes: projectPageMarkerAnnotationTypes,
  insertTextMarkerAnnotationTypes: projectInsertTextMarkerAnnotationTypes,

  getAnnotationCategory: getAnnotationCategory,
  getHighlightCategory: getHighlightCategory,
  isEntity: isEntity,

  showPrevNextScanButtons: true,
  pageAnnotation: "tf:Page",
  elasticIndexName: "suriano-1.0.1e-029",
  initialDateFrom: "1600-01-01",
  initialDateTo: "1700-01-01",
  initialRangeFrom: "0",
  initialRangeTo: "30000",
  maxRange: 30000,
  logoImageUrl: logo,
  headerColor: "bg-brand2-800 text-white",
  headerTitle: "",
  showSearchResultsButtonFooter: false,
  useExternalConfig: true,
  showToggleTextPanels: false,
  showKeywordFacets: false,
  showFacetFilter: false,
  showMiradorNavigationButtons: false,
  components: {
    EntitySummary,
    SearchItem,
    MetadataPanel,
    AnnotationButtons,
    SearchInfoPage,
    HelpLink: Empty,
  },

  selectedLanguage: "en",
  languages: [{ code: "en", labels: englishSurianoLabels }],
  showSearchResultsOnInfoPage: true,
  overrideDefaultSearchParams: {
    sortBy: "date",
    sortOrder: "asc",
  },
  projectCss: projectCss,
} as ProjectSpecificConfig);
