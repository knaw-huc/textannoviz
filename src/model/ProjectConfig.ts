import { MarkerSegment } from "../components/Text/Annotated/core";
import { EntitySummaryProps } from "../components/Text/Annotated/project/EntitySummaryProps.ts";
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
import { NoteReferenceBody } from "../projects/kunstenaarsbrieven/annotation/ProjectAnnotationModel.ts";
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
    projectCss: string;

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
  InsertMarkerAnnotation: (props: { marker: MarkerSegment }) => JSX.Element;
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
   * @see {@link tooltipMarkerAnnotationTypes}
   * annotation.body.type is not enough to determine if a Reference is a Note Reference:
   */
  isToolTipMarker: (toTest: AnnoRepoBodyBase) => toTest is NoteReferenceBody;

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

  annoToEntityCategory: Any;

  getAnnotationCategory: CategoryGetter;
  getHighlightCategory: CategoryGetter;
  isEntity: (toTest: AnnoRepoBodyBase) => toTest is ProjectEntityBody;

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
