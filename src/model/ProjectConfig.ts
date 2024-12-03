import { EntitySummaryProps } from "../components/Text/Annotated/details/EntitySummaryProps.ts";
import { SearchQuery } from "../stores/search/search-query-slice.ts";
import {
  AnnoRepoAnnotation,
  AnnoRepoBody,
  AnnoRepoBodyBase,
} from "./AnnoRepoAnnotation.ts";
import { Language, LanguageCode } from "./Language.ts";
import {
  GlobaliseSearchResultsBody,
  MondriaanSearchResultsBody,
  RepublicSearchResultBody,
  TranslatinSearchResultsBody,
} from "./Search.ts";

export type ProjectEntityBody = AnnoRepoBodyBase & {
  // Project specific entity type and properties
};

export type EntitySummaryDetailsProps = {
  body: ProjectEntityBody;
};

export type CategoryGetter = (annoRepoBody: AnnoRepoBody) => string;

export interface ProjectConfig {
  id: string;
  broccoliUrl: string;
  colours: Record<string, string>;

  /**
   * Offsets relative to the closest annotation of type {relativeTo}
   * - AnnoRepo finds closest annotation
   * - Broccoli calculates offsets
   */
  relativeTo: string;

  /**
   * Annotation types to load from the backend
   */
  annotationTypesToInclude: string[];

  /**
   * Should annotations be visualised using {@link AnnotatedText} component
   * as opposed to the default, more basic {@link TextHighlighting} component
   */
  showAnnotations: boolean;

  /**
   * Highlighted annotation types when using the {@link TextHighlighting} component
   * i.e. when `showAnnotations === false`
   */
  annotationTypesToHighlight: string[];
  /**
   * Show tooltip with note
   */
  tooltipMarkerAnnotationTypes: string[];
  /**
   * Insert additional text into main text
   */
  insertTextMarkerAnnotationTypes: string[];
  /**
   * Mark the start of a page
   */
  pageMarkerAnnotationTypes: string[];
  /**
   * Annotation types that are highlighted in the text
   * and that can be clicked on and opened in the annotation detail viewer
   */
  entityAnnotationTypes: string[];
  /**
   * Annotation types that are highlighted in the text
   * but that cannot be clicked on
   */
  highlightedAnnotationTypes: string[];

  getAnnotationCategory: CategoryGetter;
  getHighlightCategory: CategoryGetter;
  isEntity: (toTest: AnnoRepoBodyBase) => toTest is ProjectEntityBody;

  elasticIndexName: string;
  initialDateFrom: string;
  initialDateTo: string;
  initialRangeFrom: string;
  initialRangeTo: string;
  maxRange: number;
  allPossibleTextPanels: string[];
  defaultTextPanels: string[];
  showSearchSortBy: boolean;
  showSearchResultsButtonFooter: boolean;
  showFacsimileButtonFooter: boolean;
  showSettingsMenuFooter: boolean;
  defaultShowMetadataPanel: boolean;
  showToggleTextPanels: boolean;
  zoomAnnoMirador: boolean;
  logoImageUrl: string;
  headerTitle: string;
  logoHref: string;
  headerColor: string;
  showSearchQueryHistory: boolean;
  showDateFacets: boolean;
  showKeywordFacets: boolean;
  showSliderFacets: boolean;
  showSelectedFilters: boolean;
  showNewSearchButton: boolean;
  allowCloseTextPanel: boolean;
  showWebAnnoTab: boolean;
  histogramFacet: string;
  showHistogram: boolean;
  useExternalConfig: boolean;
  visualizeAnnosMirador: boolean;
  allowEmptyStringSearch: boolean;
  showMirador: boolean;
  showMiradorNavigationButtons: boolean;
  showInputFacet: boolean;
  selectedLanguage: LanguageCode;
  inputFacetOptions: string;
  languages: Language[];
  overrideDefaultAggs: {
    facetName: string;
    order?: string;
    size?: number;
  }[];
  defaultKeywordAggsToRender: string[];
  showFacetFilter: boolean;
  pageAnnotation: string;
  showPrevNextScanButtons: boolean;
  mirador: {
    showWindowSideBar: boolean;
    showTopMenuButton: boolean;
  };
  components: {
    AnnotationButtons: () => JSX.Element;
    AnnotationItem: (props: AnnotationItemProps) => JSX.Element;
    AnnotationItemContent: (props: {
      annotation: AnnoRepoAnnotation;
    }) => JSX.Element;
    AnnotationLinks: () => JSX.Element | null;
    EntitySummary: (props: EntitySummaryProps) => JSX.Element;
    Help: () => JSX.Element;
    HelpLink: () => JSX.Element;
    MetadataPanel: (props: {
      annotations: AnnoRepoAnnotation[];
    }) => JSX.Element;
    SearchInfoPage: () => JSX.Element;
    SearchItem: (props: {
      query: SearchQuery;
      result:
        | RepublicSearchResultBody
        | TranslatinSearchResultsBody
        | MondriaanSearchResultsBody
        | GlobaliseSearchResultsBody;
    }) => JSX.Element;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    EntityMetadata: (props: { body: any }) => JSX.Element;
    BrowseScanButtons: () => JSX.Element;
  };
}

export interface AnnotationItemProps {
  annotation: AnnoRepoAnnotation;
}
