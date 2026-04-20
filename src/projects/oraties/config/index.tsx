import merge from "lodash/merge";
import logo from "../../../assets/logo-huygens-wit.png";
import {
  ProjectConfig,
  ProjectSpecificConfig,
} from "../../../model/ProjectConfig";
import { defaultConfig } from "../../default/config";
import { defaultAnnotatedTextConfig } from "../../default/annotation/defaultAnnotatedTextConfig";
import { OratiesMarker } from "../annotation/OratiesMarker";
import { SearchItem } from "../SearchItem";
import { dutchOratiesLabels } from "./dutchOratiesLabels";
import { MetadataPanel } from "../MetadataPanel";
import { SearchInfoPage } from "../SearchInfoPage";
import { Header } from "../Header";
import { PanelTemplates } from "../../../components/Detail/PanelTemplates.tsx";
import { TextPanels } from "../TextPanels.tsx";
import { NotesPanel } from "../NotesPanel.tsx";
import { Persons } from "../Persons.tsx";
import { EntitySummary } from "../../vangogh/annotation/EntitySummary.tsx";
import {
  getAnnotationCategory,
  getHighlightCategory,
  isBibliographyReference,
  isEntity,
  person,
  projectEntityTypes,
  projectHighlightedTypes,
  projectPageMarkerAnnotationTypes,
  reference,
  teiArtwork,
} from "../annotation/ProjectAnnotationModel.ts";

export const oratiesConfig: ProjectConfig = merge({}, defaultConfig, {
  id: "oraties",

  headerTitle: "Oraties",
  headerColor: "bg-brand1-800 text-white",
  personsUrl: "http://localhost:8040/files/oraties/apparatus/bio-entities.json",

  logoImageUrl: logo,
  logoHref: "https://www.huygens.knaw.nl/",

  languages: [{ code: "nl", labels: dutchOratiesLabels }],
  selectedLanguage: "nl",

  showNotesTab: true,
  useExternalConfig: true,

  broccoliUrl: "http://localhost:8082",

  detailPanels: [
    {
      name: "facs",
      visible: true,
      disabled: false,
      region: "left",
      size: "minmax(300px, 650fr)",
      panel: PanelTemplates.facsPanel,
    },
    {
      name: "text.orig",
      visible: true,
      disabled: false,
      region: "main",
      size: "minmax(300px, 750fr)",
      panel: TextPanels.origTextPanel,
    },
    {
      name: "metadata",
      visible: true,
      disabled: false,
      region: "right",
      size: "minmax(300px, 400fr)",
      panel: PanelTemplates.metadataPanel,
    },
  ],
  routes: [
    {
      path: "persons",
      element: <Persons />,
    },
  ],

  // FacsimileConfig
  showFacsimile: true,
  showMiradorNavigationButtons: true,

  // SearchConfig
  elasticIndexName: "oraties",
  initialDateFrom: "2026-03-04",
  initialDateTo: "2026-03-04",
  showSearchResultsButtonFooter: false,
  showSearchResultsOnInfoPage: true,
  defaultKeywordAggsToRender: ["author", "location"],
  overrideDefaultSearchParams: {
    sortBy: "date",
    sortOrder: "asc",
  },
  viewsToSearchIn: ["lectureOriginalText"],

  // ProjectSpecificConfig
  components: {
    Header,
    SearchItem,
    MetadataPanel,
    SearchInfoPage,
    NotesPanel,
    Persons,
    EntitySummary,
  },

  // TextConfig
  allPossibleTextPanels: ["text", "textNotes"],

  // AnnotationConfig
  showAnnotations: true,
  annotatedTextConfig: {
    ...defaultAnnotatedTextConfig,
    Marker: OratiesMarker,
  },
  relativeTo: "Document",
  annotationTypesToInclude: [
    "Division",
    "Document",
    "Entity",
    "Head",
    "Highlight",
    "List",
    "Note",
    "Page",
    "Paragraph",
    "Reference",
    "Section",
    "Whitespace",
  ],
  isMarker: (body) => projectPageMarkerAnnotationTypes.includes(body.type),

  /**
   * Note: duplicated from kunstenaarsbrieven
   * TODO: move to projects/common?
   */
  highlightTypes: projectHighlightedTypes,
  nestedTypes: projectEntityTypes,
  getAnnotationCategory: getAnnotationCategory,
  getHighlightCategory: getHighlightCategory,
  isEntity: isEntity,
  isLink: isBibliographyReference,
  getUrl: (a) => isBibliographyReference(a) && a.url,
  annoToEntityCategory: {
    [person]: "PER",
    [teiArtwork]: "ART",
    [reference.toLowerCase()]: "REF",
    PER: "PER",
  },
} as ProjectSpecificConfig);
