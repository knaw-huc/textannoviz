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

export type ProjectEntityBody = AnnoRepoBodyBase;

export type EntitySummaryDetailsProps = {
  body: ProjectEntityBody;
};

export type EntityCategoryGetter = (annoRepoBoby: AnnoRepoBody) => string;

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

  showAnnotations: boolean;
  /**
   * Annotation types to load from the backend
   */
  annotationTypesToInclude: string[];
  /**
   * Default annotation types that are highlighted in the text
   */
  annotationTypesToHighlight: string[];
  /**
   * All annotations that are potentially highlightable
   */
  allowedAnnotationTypesToHighlight: string[];
  /**
   * Footnote markers, showing a tooltip with the note
   */
  footnoteMarkerAnnotationTypes: string[];
  /**
   * Annotations marking the start or end of a page
   */
  pageMarkerAnnotationTypes: string[];
  /**
   * Annotations that can be clicked and opened in the detail viewer
   */
  entityAnnotationTypes: string[];
  getEntityCategory: EntityCategoryGetter;
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
    order: string;
    size: number;
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
    EntitySummaryDetails: (props: EntitySummaryDetailsProps) => JSX.Element;
    Help: () => JSX.Element;
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
