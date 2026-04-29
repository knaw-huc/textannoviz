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
import { getTocId, showToc } from "./showToc.ts";
import { getUrl, isLink } from "./isLink.ts";
import { defaultAnnotatedTextConfig } from "../annotation/defaultAnnotatedTextConfig.ts";

/**
 * Default configuration file with some sensible defaults
 * which can be extended and overwritten by projects
 */
export const defaultConfig: DefaultProjectConfig = {
  broccoliUrl: "https://broccoli.tt.di.huc.knaw.nl",
  colours: {},
  relativeTo: "",
  siteTitle: "Textannoviz",

  showAnnotations: false,

  annotationTypesToInclude: [],
  textHighlightingTypes: [],
  annotatedTextConfig: defaultAnnotatedTextConfig,
  nestedTypes: [],
  highlightTypes: [],
  isMarker: () => false,
  getAnnotationCategory: getCategory,
  getHighlightCategory: getCategory,
  isEntity: isEntity,
  isLink: isLink,
  getUrl: getUrl,

  personsUrl: "",
  artworksUrl: "",
  biblUrl: { en: "", nl: "" },
  initialRangeFrom: "0",
  initialRangeTo: "30000",
  maxRange: 30000,
  logoImageUrl: "",
  allPossibleTextPanels: ["self"],
  defaultTextPanels: "self",
  showSearchSortBy: true,
  showSearchResultsButtonFooter: false,
  showToggleTextPanels: false,
  zoomToAnnoOnFacsimile: false,
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
  showAnnosOnFacsimile: false,
  allowEmptyStringSearch: true,
  showFacsimile: true,
  showFacsimilePrevNextScanButtonsButtons: false,
  showInputFacet: false,
  histogramFacet: "",
  inputFacetOptions: "",
  overrideDefaultAggs: [],
  overrideDefaultSearchParams: {},
  defaultKeywordAggsToRender: [],
  showFacetFilter: true,
  showPrevNextScanButtons: false,
  pageAnnotation: "",
  showToc: showToc,
  getTocId: getTocId,
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
    Header: Header,
    TocPanel: Placeholder,
  },
  selectedLanguage: "en",
  languages: [
    {
      code: "en",
      labels: englishLabels,
    },
  ],
  showSearchResultsOnInfoPage: false,
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
      name: "text.self",
      visible: true,
      disabled: false,
      region: "main",
      size: "minmax(300px, 750fr)",
      panel: TextPanels.self,
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
  routes: [],
  searchSorting: [],
  annoToEntityCategory: "",
  viewsToSearchIn: [],
  showSearchInTextViews: false,
};
