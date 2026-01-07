import merge from "lodash/merge";
import logo from "../../../assets/logo-republic-temp.png";
import {
  ProjectConfig,
  ProjectSpecificConfig,
} from "../../../model/ProjectConfig";
import { defaultConfig } from "../../default/config";
import { NotesPanel } from "../NotesPanel";
import {
  teiArtwork,
  document,
  getAnnotationCategory,
  getHighlightCategory,
  isEntity,
  letter,
  note,
  person,
  projectAnnotationTypesToInclude,
  projectEntityTypes,
  projectHighlightedTypes,
  projectInsertTextMarkerAnnotationTypes,
  projectPageMarkerAnnotationTypes,
  reference,
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
import { Help } from "../Help";
import { TextPanels } from "../TextPanels";

export const israelsConfig: ProjectConfig = merge({}, defaultConfig, {
  id: "israels",
  // broccoliUrl: "https://preview.dev.diginfra.org/broccoli",
  broccoliUrl: "http://localhost:8082",
  relativeTo: document,
  // TODO: pick relevant types:
  annotationTypesToInclude: [
    "Dataset",
    "Division",
    document,
    letter,
    note,
    ...projectAnnotationTypesToInclude,
    // "Division",
    // "Dataset",
    // "Document",
    // "Entity",
    // "Head",
    // "Highlight",
    // "Letter",
    // "Line",
    // "List",
    // "ListItem",
    // "Page",
    // "Paragraph",
    // "Picture",
    // "Quote",
    // "Reference",
    // "Whitespace",
  ],
  showAnnotations: true,
  highlightedAnnotationTypes: projectHighlightedTypes,
  pageMarkerAnnotationTypes: projectPageMarkerAnnotationTypes,
  entityAnnotationTypes: projectEntityTypes,
  insertTextMarkerAnnotationTypes: projectInsertTextMarkerAnnotationTypes,
  getAnnotationCategory: getAnnotationCategory,
  getHighlightCategory: getHighlightCategory,
  isEntity: isEntity,

  elasticIndexName: "israels",
  initialDateFrom: "1891-01-01",
  initialDateTo: "1924-12-31",
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
  showWebAnnoTab: true,
  showFragmenter: true,
  defaultKeywordAggsToRender: [
    "type",
    "location",
    "period",
    "file",
    "persons",
    // "artworksNL",
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
    Help,
  },
  selectedLanguage: "en",
  zoomAnnoMirador: true,
  miradorZoomRatio: 1.5,
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
      panel: TextPanels.origTextPanel,
    },
    {
      name: "text.en",
      visible: true,
      disabled: false,
      size: "minmax(300px, 750px)",
      panel: TextPanels.transTextPanel,
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
    // TODO: sorting by file results in {"code":400,"message":"query param sortBy must be one of [_doc, _score, author, datePublished, editor, identifier, subtitle, title, type]"}
    sortBy: "file",
    sortOrder: "asc",
  },
  annoToEntityCategory: {
    [person]: "PER",
    [teiArtwork]: "ART",
    [reference.toLowerCase()]: "REF",
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
  showSearchInTextViews: true,
} as ProjectSpecificConfig);
