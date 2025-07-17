import merge from "lodash/merge";
import logo from "../../../assets/logo-republic-temp.png";
import {
  ProjectConfig,
  ProjectSpecificConfig,
} from "../../../model/ProjectConfig";
import { defaultConfig } from "../../default/config";
import { NotesPanel } from "../NotesPanel";
import {
  getAnnotationCategory,
  getHighlightCategory,
  isEntity,
  projectEntityTypes,
  projectHighlightedTypes,
  projectInsertTextMarkerAnnotationTypes,
  projectPageMarkerAnnotationTypes,
  projectTooltipMarkerAnnotationTypes,
} from "../annotation/ProjectAnnotationModel";
import { AnnotationButtons } from "../AnnotationButtons";
import { ArtworksTab } from "../ArtworksTab";
import { MetadataPanel } from "../MetadataPanel";
import projectCss from "../project.css?inline";
import { SearchItem } from "../SearchItem";
import { englishIsraelsLabels } from "./englishIsraelsLabels";
import { PanelTemplates } from "../../../components/Detail/PanelTemplates";
import { EntitySummary } from "../annotation/EntitySummary";
import { Persons } from "../Persons";
import { Artworks } from "../Artworks";
import { ASC, DESC } from "../../../model/Search";
import { dutchIsraelsLabels } from "./dutchIsraelsLabels";
import { Any } from "../../../utils/Any";
import { InsertMarkerAnnotation } from "../InsertMarkerAnnotation";
import { SearchInfoPage } from "../SearchInfoPage";
import { Header } from "../Header";
import { Bibliography } from "../Bibliography";

export const israelsConfig: ProjectConfig = merge({}, defaultConfig, {
  id: "israels",
  // broccoliUrl: "https://preview.dev.diginfra.org/broccoli",
  broccoliUrl: "http://localhost:8040/broccoli",
  relativeTo: "tf:Letter",
  annotationTypesToInclude: [
    "tei:AltIdentifier",
    // "tei:Availability",
    // "tei:Body",
    // "tei:CorrespAction",
    // "tei:CorrespDesc",
    // "tei:Country",
    // "tei:Date",
    "tei:Div",
    // "tei:Facsimile",
    "tei:Figure",
    // "tei:FileDesc",
    "tei:Graphic",
    "tei:Head",
    "tei:Hi",
    "tei:Idno",
    // "tei:Institution",
    // "tei:L",
    // "tei:Lg",
    // "tei:Licence",
    "tei:ListAnnotation",
    // "tei:MsDesc",
    // "tei:MsIdentifier",
    // "tei:Name",
    "tei:Note",
    // "tei:ObjectDesc",
    // "tei:P",
    // "tei:PhysDesc",
    // "tei:PlaceName",
    // "tei:ProfileDesc",
    "tei:Ptr",
    // "tei:PubPlace",
    // "tei:PublicationStmt",
    // "tei:Publisher",
    // "tei:Quote",
    "tei:Ref",
    "tei:Rs",
    // "tei:Seg",
    // "tei:Settlement",
    // "tei:SourceDesc",
    "tei:Space",
    // "tei:StandOff",
    // "tei:Surface",
    // "tei:TeiHeader",
    // "tei:Text",
    // "tei:Title",
    // "tei:TitleStmt",
    // "tei:Zone",
    "tf:File",
    "tf:Letter",
    "tf:Page",
    // "tt:LetterBody",
  ],
  showAnnotations: true,
  highlightedAnnotationTypes: projectHighlightedTypes,
  tooltipMarkerAnnotationTypes: projectTooltipMarkerAnnotationTypes,
  pageMarkerAnnotationTypes: projectPageMarkerAnnotationTypes,
  entityAnnotationTypes: projectEntityTypes,
  insertTextMarkerAnnotationTypes: projectInsertTextMarkerAnnotationTypes,
  getAnnotationCategory: getAnnotationCategory,
  getHighlightCategory: getHighlightCategory,
  isEntity: isEntity,

  elasticIndexName: "israels",
  initialDateFrom: "1600-01-01",
  initialDateTo: "2000-01-01",
  initialRangeFrom: "0",
  initialRangeTo: "30000",
  maxRange: 30000,
  logoImageUrl: logo,
  headerColor: "bg-[#dddddd] text-black border-b border-neutral-400",
  headerTitle: "Brieven van Isaac Israëls",
  showSearchResultsButtonFooter: false,
  useExternalConfig: true,
  showToggleTextPanels: true,
  showSearchResultsOnInfoPage: true,
  defaultKeywordAggsToRender: [
    "type",
    "location",
    "period",
    "file",
    "persons",
    "artworksNL",
    "artworksEN",
  ],
  overrideDefaultAggs: [
    {
      facetName: "persons",
      order: "keyAsc",
      size: 200,
    },
    {
      facetName: "artworksNL",
      size: 200,
    },
    {
      facetName: "artworksEN",
      size: 200,
    },
    {
      facetName: "file",
      order: "keyAsc",
      size: 200,
    },
  ],
  showNotesTab: true,
  showArtworksTab: true,
  components: {
    SearchItem,
    MetadataPanel,
    AnnotationButtons,
    NotesPanel,
    ArtworksTab,
    EntitySummary,
    InsertMarkerAnnotation,
    SearchInfoPage,
    Header,
  },
  defaultLanguage: "en",
  zoomAnnoMirador: true,
  languages: [
    { code: "nl", labels: dutchIsraelsLabels },
    { code: "en", labels: englishIsraelsLabels },
  ],
  detailPanels: [
    {
      name: "facs",
      visible: true,
      disabled: false,
      size: "minmax(300px, 650px)",
      panel: PanelTemplates.facsPanel,
    },
    {
      name: "text.nl",
      visible: true,
      disabled: false,
      size: "minmax(300px, 750px)",
      panel: PanelTemplates.origTextPanel,
    },
    {
      name: "text.en",
      visible: true,
      disabled: false,
      size: "minmax(300px, 750px)",
      panel: PanelTemplates.transTextPanel,
    },
    {
      name: "metadata",
      visible: true,
      disabled: false,
      size: "minmax(300px, 400px)",
      panel: PanelTemplates.metadataPanel,
    },
  ],
  allPossibleTextPanels: ["text", "textNotes", "typedNotes"],
  defaultTextPanels: "text",
  projectCss: projectCss,
  routes: [
    {
      path: "persons",
      element: <Persons />,
    },
    {
      path: "artworks",
      element: <Artworks />,
    },
    {
      path: "bibliography",
      element: <Bibliography />,
    },
  ],
  searchSorting: [
    { name: "Letter number (ascending)", value: `file-${ASC}` },
    { name: "Letter number (descending)", value: `file-${DESC}` },
  ],
  overrideDefaultSearchParams: {
    sortBy: "file",
    sortOrder: "asc",
  },
  annoToEntityCategory: {
    person: "PER",
    artwork: "ART",
    "tei-ref": "REF",
    PER: "PER",
  } as Any,
  viewsToSearchIn: [
    "letterOriginalText",
    "letterTranslatedText",
    "letterNotesText",
    "introOriginalText",
    "introTranslatedText",
    "introNotesText",
  ],
  showMiradorNavigationButtons: true,
} as ProjectSpecificConfig);
