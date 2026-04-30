import { AnyAnnotatedTextConfig } from "../components/Text/Annotated/core";
import { EntitySummaryProps } from "./EntitySummaryProps.ts";
import { Any } from "../utils/Any.ts";
import { AnnoRepoAnnotation, AnnoRepoBodyBase } from "./AnnoRepoAnnotation.ts";
import { Language, LanguageCode } from "./Language.ts";
import {
  BrederodeSearchResultsBody,
  GlobaliseSearchResultsBody,
  IsraelsSearchResultsBody,
  MondriaanSearchResultsBody,
  OratiesSearchResultsBody,
  RepublicSearchResultBody,
  SearchParams,
  SearchQuery,
  SurianoSearchResultsBody,
  TranslatinSearchResultsBody,
  VanGoghSearchResultsBody,
} from "./Search.ts";
import type { JSX } from "react";

export type PanelRegion = "left" | "main" | "right";
export type DetailPanelConfig = {
  name: string;
  visible: boolean;
  size: string;
  region: PanelRegion;
  disabled: boolean;
  panel: {
    content: JSX.Element;
  };
};

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

    /**
     * See {@link ProjectConfig.NotesPanel}
     */
    showNotesTab: boolean;
    showArtworksTab: boolean;
    personsUrl: string;
    artworksUrl: string;
    biblUrl: Partial<Record<LanguageCode, string>>;
    siteTitle: string;

    detailPanels: DetailPanelConfig[];

    components: ComponentsConfig;

    routes: {
      path: string;
      element: JSX.Element;
    }[];
  };

type FacsimileConfig = {
  zoomToAnnoOnFacsimile: boolean;
  showAnnosOnFacsimile: boolean;
  showFacsimile: boolean;
  pageAnnotation: string;
  showPrevNextScanButtons: boolean;
  showFacsimilePrevNextScanButtonsButtons: boolean;
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
      | VanGoghSearchResultsBody
      | IsraelsSearchResultsBody
      | BrederodeSearchResultsBody
      | OratiesSearchResultsBody;
  }) => JSX.Element;
  BrowseScanButtons: () => JSX.Element;
  NotesPanel: () => JSX.Element;
  ArtworksTab: () => JSX.Element;
  Header: () => JSX.Element;
  TocPanel: () => JSX.Element;
};

type TextConfig = {
  allPossibleTextPanels: string[];
  defaultTextPanels: string;
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
  showFragmenter: boolean;
  showTopSearchPagination: boolean;
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
  searchSorting: { name: string; value: string }[];
  viewsToSearchIn: string[];
  showSearchInTextViews: boolean;
};

type AnnotationConfig = {
  /**
   * Offsets relative to the closest annotation of type {relativeTo}
   * - AnnoRepo finds closest annotation
   * - Broccoli calculates offsets
   */
  relativeTo: string;

  /**
   * Should annotations be visualised using {@link AnnotatedText}
   * as opposed to the default, more basic {@link TextHighlighting}
   */
  showAnnotations: boolean;

  /**
   * Annotation types to load from the backend
   */
  annotationTypesToInclude: string[];

  /**
   * Highlighted annotation types when using the {@link TextHighlighting} component
   * i.e. when `showAnnotations === false`
   */
  textHighlightingTypes: string[];

  /**
   * Plugin components for rendering with {@link AnnotatedText}
   */
  annotatedTextConfig: AnyAnnotatedTextConfig;

  /**
   * Annotations that are nested inside each other, a span for every annotation
   * see also {@link isEntity}
   */
  nestedTypes: string[];

  /**
   * Annotation types that are highlighted in the text
   */
  highlightTypes: string[];

  /**
   * Annotations that should be rendered as zero-length markers
   * e.g., page breaks, note pointers, pictures
   * Note: some markers cannot be detected using type alone, hence the fn
   */
  isMarker: (body: AnnoRepoBodyBase) => boolean;

  /**
   * Entities, clickable, styled and displayed in the EntityModal
   */
  isEntity: (toTest: AnnoRepoBodyBase) => toTest is ProjectEntityBody;

  annoToEntityCategory: Any;

  getAnnotationCategory: CategoryGetter;
  getHighlightCategory: CategoryGetter;

  isLink: (toTest: AnnoRepoBodyBase) => boolean;
  getUrl: (toTest: AnnoRepoBodyBase) => string | undefined;

  showToc: (annotations: AnnoRepoAnnotation[]) => boolean;
  getTocId: (body: AnnoRepoBodyBase) => string | undefined;

  filterPanels?: (
    panels: DetailPanelConfig[],
    annotations: AnnoRepoAnnotation[],
  ) => string[];
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

export type CategoryGetter = (annoRepoBody: AnnoRepoBodyBase) => string;

export type ProjectSpecificProperties =
  | "id"
  | "elasticIndexName"
  | "headerTitle"
  | "initialDateFrom"
  | "initialDateTo"
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
  Omit<Partial<ProjectConfig>, "components"> & {
    components?: Partial<ComponentsConfig>;
  };
