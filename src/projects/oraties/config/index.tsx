import merge from "lodash/merge";
import logo from "../../../assets/logo-huygens.png";
import {
  ProjectConfig,
  ProjectSpecificConfig,
} from "../../../model/ProjectConfig";
import { defaultConfig } from "../../default/config";
import { SearchItem } from "../SearchItem";
import { dutchOratiesLabels } from "./dutchOratiesLabels";
import { MetadataPanel } from "../MetadataPanel";
import { projectPageMarkerAnnotationTypes } from "../annotation/ProjectAnnotationModel";
import { SearchInfoPage } from "../SearchInfoPage";
import { Header } from "../Header";
import { PanelTemplates } from "../../../components/Detail/PanelTemplates.tsx";
import { TextPanels } from "../TextPanels.tsx";
import { NotesPanel } from "../NotesPanel.tsx";
import { Persons } from "../Persons.tsx";
import { EntitySummary } from "../../vangogh/annotation/EntitySummary.tsx";

export const oratiesConfig: ProjectConfig = merge({}, defaultConfig, {
  id: "oraties",

  headerTitle: "Oraties",
  headerColor: "bg-brand1-100 text-brand1-800",

  logoImageUrl: logo,
  logoHref: "https://www.huygens.knaw.nl/",

  languages: [{ code: "nl", labels: dutchOratiesLabels }],
  selectedLanguage: "nl",

  showNotesTab: true,
  visualizeAnnosMirador: true,
  useExternalConfig: true,

  broccoliUrl: "http://localhost:8082",

  detailPanels: [
    {
      name: "facs",
      visible: true,
      disabled: false,
      size: "minmax(300px, 650px)",
      panel: PanelTemplates.facsPanel,
    },
    {
      name: "text.orig",
      visible: true,
      disabled: false,
      size: "minmax(300px, 750px)",
      panel: TextPanels.origTextPanel,
    },
    {
      name: "metadata",
      visible: true,
      disabled: false,
      size: "minmax(300px, 400px)",
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
  showMirador: true,
  showMiradorNavigationButtons: true,

  // SearchConfig
  elasticIndexName: "oraties",
  initialDateFrom: "2026-03-04",
  initialDateTo: "2026-03-04",
  showSearchResultsButtonFooter: false,
  showSearchResultsOnInfoPage: true,
  defaultKeywordAggsToRender: ["author", "publisher", "location"],
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
  pageMarkerAnnotationTypes: projectPageMarkerAnnotationTypes,
} as ProjectSpecificConfig);
