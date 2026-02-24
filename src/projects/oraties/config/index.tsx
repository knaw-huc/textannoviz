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

  broccoliUrl: "http://localhost:8082",

  elasticIndexName: "oraties",
  initialDateFrom: "2026-03-04",
  initialDateTo: "2026-03-04",
  headerColor: "bg-brand1-100 text-brand1-800",
  headerTitle: "Oraties",

  components: {
    Header,
    SearchItem,
    MetadataPanel,
    SearchInfoPage,
    NotesPanel,
    Persons,
    EntitySummary,
  },

  defaultKeywordAggsToRender: ["author", "publisher", "location"],
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
  viewsToSearchIn: ["lectureOriginalText"],
  selectedLanguage: "nl",
  languages: [{ code: "nl", labels: dutchOratiesLabels }],
  // routes: [
  //   {
  //     path: "persons",
  //     element: <Persons />,
  //   },
  // ],

  allPossibleTextPanels: ["text", "textNotes"],

  initialRangeFrom: "0",
  initialRangeTo: "30000",
  maxRange: 30000,

  logoImageUrl: logo,
  pageMarkerAnnotationTypes: projectPageMarkerAnnotationTypes,
  showAnnotations: true,
  showMirador: true,
  showMiradorNavigationButtons: true,
  showNotesTab: true,
  showSearchResultsButtonFooter: false,
  showSearchResultsOnInfoPage: true,
  useExternalConfig: true,
  overrideDefaultSearchParams: {
    sortBy: "date",
    sortOrder: "asc",
  },
} as ProjectSpecificConfig);
