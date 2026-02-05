import { PanelTemplates } from "../../../components/Detail/PanelTemplates.tsx";
import { Empty } from "../../../components/Empty.tsx";
import { Placeholder } from "../../../components/Placeholder.tsx";
import { DefaultProjectConfig } from "../../../model/ProjectConfig.ts";
import { AnnotationItem } from "../AnnotationItem.tsx";
import { AnnotationItemContent } from "../AnnotationItemContent.tsx";
import { Header } from "../Header.tsx";
import { SearchItem } from "../SearchItem.tsx";
import { TextPanels } from "../TextPanels.tsx";
import { englishLabels } from "./englishLabels.ts";
import { getCategory } from "./getCategory.ts";
import { isEntity } from "./isEntity.ts";
import { isNoteReference } from "../../israels/annotation/ProjectAnnotationModel.ts";

/**
 * Default configuration file with some sensible defaults
 * which can be extended and overwritten by projects
 */
export const defaultConfig: DefaultProjectConfig = {
  broccoliUrl: "https://broccoli.tt.di.huc.knaw.nl",
  colours: {},
  relativeTo: "",

  showAnnotations: false,

  annotationTypesToInclude: [],
  annotationTypesToHighlight: [],

  tooltipMarkerAnnotationTypes: [],
  insertTextMarkerAnnotationTypes: [],
  pageMarkerAnnotationTypes: [],
  entityAnnotationTypes: [],
  highlightedAnnotationTypes: [],
  getAnnotationCategory: getCategory,
  getHighlightCategory: getCategory,
  isEntity: isEntity,
  isToolTipMarker: isNoteReference,

  initialRangeFrom: "0",
  initialRangeTo: "30000",
  maxRange: 30000,
  logoImageUrl: "",
  allPossibleTextPanels: ["self"],
  defaultTextPanels: "self",
  showSearchSortBy: true,
  showFacsimileButtonFooter: false,
  showSearchResultsButtonFooter: false,
  showSettingsMenuFooter: false,
  defaultShowMetadataPanel: true,
  showToggleTextPanels: false,
  zoomAnnoMirador: false,
  miradorZoomRatio: 0.75,
  logoHref: "/",
  showSearchQueryHistory: true,
  showDateFacets: true,
  showKeywordFacets: true,
  showSliderFacets: false,
  showSelectedFilters: true,
  showFragmenter: true,
  showTopSearchPagination: false,
  showNewSearchButton: true,
  allowCloseTextPanel: false,
  showWebAnnoTab: true,
  showNotesTab: false,
  showArtworksTab: false,
  showHistogram: false,
  useExternalConfig: false,
  visualizeAnnosMirador: false,
  allowEmptyStringSearch: true,
  showMirador: true,
  showMiradorNavigationButtons: false,
  showInputFacet: false,
  histogramFacet: "",
  inputFacetOptions: "",
  overrideDefaultAggs: [],
  overrideDefaultSearchParams: {},
  defaultKeywordAggsToRender: [],
  showFacetFilter: true,
  showPrevNextScanButtons: false,
  pageAnnotation: "",
  components: {
    AnnotationItem: AnnotationItem,
    AnnotationItemContent: AnnotationItemContent,
    AnnotationLinks: Placeholder,
    AnnotationButtons: Empty,
    EntitySummary: Placeholder,
    Help: Placeholder,
    HelpLink: Empty,
    MetadataPanel: Placeholder,
    SearchInfoPage: Placeholder,
    SearchItem: SearchItem,
    BrowseScanButtons: Empty,
    NotesPanel: Placeholder,
    ArtworksTab: Placeholder,
    InsertMarkerAnnotation: Empty,
    Header: Header,
  },
  selectedLanguage: "en",
  languages: [
    {
      code: "en",
      labels: englishLabels,
    },
  ],
  mirador: {
    showWindowSideBar: false,
    showTopMenuButton: false,
  },
  showSearchResultsOnInfoPage: false,
  projectCss: "",
  detailPanels: [
    {
      name: "facs",
      visible: true,
      disabled: false,
      size: "minmax(300px, 650px)",
      panel: PanelTemplates.facsPanel,
    },
    {
      name: "text.self",
      visible: true,
      disabled: false,
      size: "minmax(300px, 750px)",
      panel: TextPanels.self,
    },
    {
      name: "metadata",
      visible: true,
      disabled: false,
      size: "minmax(300px, 400px)",
      panel: PanelTemplates.metadataPanel,
    },
  ],
  routes: [],
  searchSorting: [],
  annoToEntityCategory: "",
  viewsToSearchIn: [],
  showSearchInTextViews: false,
};
