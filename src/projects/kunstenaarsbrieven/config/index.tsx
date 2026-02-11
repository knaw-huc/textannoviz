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
import { MetadataPanel } from "../MetadataPanel";
import projectCss from "../project.css?inline";
import { SearchItem } from "../SearchItem";
import { englishIsraelsLabels } from "./englishIsraelsLabels";
import { PanelTemplates } from "../../../components/Detail/PanelTemplates";
import { EntitySummary } from "../annotation/EntitySummary";
import { ASC, DESC } from "../../../model/Search";
import { dutchIsraelsLabels } from "./dutchIsraelsLabels";
import { Any } from "../../../utils/Any";
import { InsertMarkerAnnotation } from "../InsertMarkerAnnotation";
import { SearchInfoPage } from "../SearchInfoPage";
import { Header } from "../Header";
import { TextPanels } from "../TextPanels";

export const kunstenaarsbrievenConfig: DefaultProjectConfig = merge(
  {},
  defaultConfig,
  {
    relativeTo: document,
    annotationTypesToInclude: [
      "Dataset",
      "Division",
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
      MetadataPanel,
      NotesPanel,
      ArtworksTab,
      EntitySummary,
      InsertMarkerAnnotation,
      SearchInfoPage,
      Header,
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
        name: "text.orig",
        visible: true,
        disabled: false,
        size: "minmax(300px, 750px)",
        panel: TextPanels.origTextPanel,
      },
      {
        name: "text.trans",
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
  },
);
