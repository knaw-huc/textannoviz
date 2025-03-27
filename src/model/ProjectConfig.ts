import { EntitySummaryProps } from "../components/Text/Annotated/details/EntitySummaryProps.ts";
import {
  AnnoRepoAnnotation,
  AnnoRepoBody,
  AnnoRepoBodyBase,
} from "./AnnoRepoAnnotation.ts";
import { Language, LanguageCode } from "./Language.ts";
import { MiradorConfig } from "./MiradorConfig.ts";
import {
  GlobaliseSearchResultsBody,
  MondriaanSearchResultsBody,
  RepublicSearchResultBody,
  SearchParams,
  SearchQuery,
  SurianoSearchResultsBody,
  TranslatinSearchResultsBody,
  VanGoghSearchResultsBody,
} from "./Search.ts";

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
    visualizeAnnosMirador: boolean;
    showWebAnnoTab: boolean;
    showNotesTab: boolean;

    detailPanels: {
      name: string;
      tabs: {
        title: string;
        content: JSX.Element;
      }[];
    }[];

    components: ComponentsConfig;
    projectCss: string;
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
};

export type ComponentsConfig = {
  AnnotationButtons: () => JSX.Element;
  AnnotationItem: (props: AnnotationItemProps) => JSX.Element;
  AnnotationItemContent: (props: {
    annotation: AnnoRepoAnnotation;
  }) => JSX.Element;
  AnnotationLinks: () => JSX.Element | null;
  EntitySummary: (props: EntitySummaryProps) => JSX.Element;
  Help: () => JSX.Element;
  HelpLink: () => JSX.Element;
  MetadataPanel: (props: { annotations: AnnoRepoAnnotation[] }) => JSX.Element;
  SearchInfoPage: () => JSX.Element;
  SearchItem: (props: {
    query: SearchQuery;
    result:
      | RepublicSearchResultBody
      | TranslatinSearchResultsBody
      | MondriaanSearchResultsBody
      | GlobaliseSearchResultsBody
      | SurianoSearchResultsBody
      | VanGoghSearchResultsBody;
  }) => JSX.Element;
  BrowseScanButtons: () => JSX.Element;
  NotesPanel: (props: { annotations: AnnoRepoAnnotation[] }) => JSX.Element;
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
  showSearchResultsOnInfoPage: boolean;
  overrideDefaultAggs: {
    facetName: string;
    order?: string;
    size?: number;
  }[];
  overrideDefaultSearchParams: Partial<SearchParams>;
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

export type ProjectSpecificProperties =
  | "id"
  | "elasticIndexName"
  | "headerTitle"
  | "initialDateFrom"
  | "initialDateTo"
  | "initialRangeFrom"
  | "initialRangeTo"
  | "maxRange"
  | "logoImageUrl"
  | "relativeTo"
  | "headerColor";

export type DefaultProjectConfig = Omit<
  ProjectConfig,
  ProjectSpecificProperties
>;

export type ProjectSpecificConfig = Pick<
  ProjectConfig,
  ProjectSpecificProperties
> &
  // Make nested config properties optional:
  Omit<Partial<ProjectConfig>, "components" | "mirador"> & {
    components?: Partial<ComponentsConfig>;
    mirador?: Partial<MiradorConfig>;
  };
