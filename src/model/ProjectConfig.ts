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
import { EntitySummaryProps } from "../components/Text/Annotated/details/EntitySummaryProps.ts";

export type ProjectConfig = SearchConfig &
  AnnotationConfig &
  TextConfig &
  FacsimileConfig & {
    id: string;
    broccoliUrl: string;
    colours: Record<string, string>;
    logoImageUrl: string;
    headerTitle: string;
    logoHref: string;
    headerColor: string;
    selectedLanguage: LanguageCode;
    languages: Language[];
    useExternalConfig: boolean;
    showWebAnnoTab: boolean;

    components: ComponentsConfig;
  };

type FacsimileConfig = {
  showFacsimileButtonFooter: boolean;
  showSettingsMenuFooter: boolean;
  defaultShowMetadataPanel: boolean;
  zoomAnnoMirador: boolean;
  showMirador: boolean;
  showMiradorNavigationButtons: boolean;
  pageAnnotation: string;
  showPrevNextScanButtons: boolean;
  mirador: {
    showWindowSideBar: boolean;
    showTopMenuButton: boolean;
  };
  visualizeAnnosMirador: boolean;
};

type ComponentsConfig = {
  AnnotationButtons: () => JSX.Element;
  AnnotationItem: (props: AnnotationItemProps) => JSX.Element;
  AnnotationItemContent: (props: {
    annotation: AnnoRepoAnnotation;
  }) => JSX.Element;
  AnnotationLinks: () => JSX.Element | null;
  EntitySummary: (props: EntitySummaryProps) => JSX.Element;
  Help: () => JSX.Element;
  MetadataPanel: (props: { annotations: AnnoRepoAnnotation[] }) => JSX.Element;
  SearchInfoPage: () => JSX.Element;
  SearchItem: (props: {
    query: SearchQuery;
    result:
      | RepublicSearchResultBody
      | TranslatinSearchResultsBody
      | MondriaanSearchResultsBody
      | GlobaliseSearchResultsBody;
  }) => JSX.Element;
  BrowseScanButtons: () => JSX.Element;
};

type TextConfig = {
  allPossibleTextPanels: string[];
  defaultTextPanels: string[];
  showToggleTextPanels: boolean;
  allowCloseTextPanel: boolean;
};

type SearchConfig = {
  elasticIndexName: string;
  initialDateFrom: string;
  initialDateTo: string;
  initialRangeFrom: string;
  initialRangeTo: string;
  maxRange: number;
  showSearchSortBy: boolean;
  showSearchResultsButtonFooter: boolean;
  showSearchQueryHistory: boolean;
  showDateFacets: boolean;
  showKeywordFacets: boolean;
  showSliderFacets: boolean;
  histogramFacet: string;
  showInputFacet: boolean;
  inputFacetOptions: string;
  showHistogram: boolean;
  showSelectedFilters: boolean;
  showNewSearchButton: boolean;
  defaultKeywordAggsToRender: string[];
  overrideDefaultAggs: {
    facetName: string;
    order: string;
    size: number;
  }[];
  allowEmptyStringSearch: boolean;
  showFacetFilter: boolean;
};

type AnnotationConfig = {
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
};

export interface AnnotationItemProps {
  annotation: AnnoRepoAnnotation;
}

export type ProjectEntityBody = AnnoRepoBodyBase & {
  // Project specific entity type and properties
};

export type EntitySummaryDetailsProps = {
  body: ProjectEntityBody;
};

export type CategoryGetter = (annoRepoBody: AnnoRepoBody) => string;
