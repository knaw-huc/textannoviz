import merge from "lodash/merge";
import logo from "../../../assets/logo-republic-temp.png";
import { DefaultProjectConfig } from "../../../model/ProjectConfig";
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
import { ArtworksTab } from "../ArtworksTab";
import projectCss from "../project.css?inline";
import { SearchItem } from "../SearchItem";
import { englishIsraelsLabels } from "./englishIsraelsLabels";
import { EntitySummary } from "../annotation/EntitySummary";
import { ASC, DESC } from "../../../model/Search";
import { dutchIsraelsLabels } from "./dutchIsraelsLabels";
import { Any } from "../../../utils/Any";
import { InsertMarkerAnnotation } from "../InsertMarkerAnnotation";
import { Header } from "../Header";

export const kunstenaarsbrievenConfig: DefaultProjectConfig = merge(
  {},
  defaultConfig,
  {
    relativeTo: document,
    annotationTypesToInclude: [
      "Dataset",
      "Division",
      "List",
      document,
      letter,
      note,
      ...projectAnnotationTypesToInclude,
    ],
    showAnnotations: true,
    highlightedAnnotationTypes: projectHighlightedTypes,
    pageMarkerAnnotationTypes: projectPageMarkerAnnotationTypes,
    entityAnnotationTypes: projectEntityTypes,
    insertTextMarkerAnnotationTypes: projectInsertTextMarkerAnnotationTypes,
    getAnnotationCategory: getAnnotationCategory,
    getHighlightCategory: getHighlightCategory,
    isEntity: isEntity,

    initialRangeFrom: "0",
    initialRangeTo: "30000",
    maxRange: 30000,
    logoImageUrl: logo,
    showSearchResultsButtonFooter: false,
    useExternalConfig: true,
    showToggleTextPanels: true,
    showSearchResultsOnInfoPage: true,
    showWebAnnoTab: true,
    showFragmenter: true,
    showNotesTab: true,
    showArtworksTab: true,
    components: {
      SearchItem,
      NotesPanel,
      ArtworksTab,
      EntitySummary,
      InsertMarkerAnnotation,
      Header,
    },
    selectedLanguage: "en",
    zoomAnnoMirador: true,
    miradorZoomRatio: 1.5,
    languages: [
      { code: "nl", labels: dutchIsraelsLabels },
      { code: "en", labels: englishIsraelsLabels },
    ],
    allPossibleTextPanels: ["text", "textNotes", "typedNotes"],
    defaultTextPanels: "text",
    projectCss: projectCss,
    searchSorting: [
      { name: "Letter number (ascending)", value: `file-${ASC}` },
      { name: "Letter number (descending)", value: `file-${DESC}` },
    ],
    overrideDefaultSearchParams: {
      sortBy: "file",
      sortOrder: "asc",
    },
    annoToEntityCategory: {
      [person]: "PER",
      [teiArtwork]: "ART",
      [reference.toLowerCase()]: "REF",
      PER: "PER",
    } as Any,
    showMiradorNavigationButtons: true,
    showSearchInTextViews: true,
  },
);
