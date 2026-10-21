import {
  AnyAnnotatedTextComponents,
  BlockSchema,
} from "../components/Text/Annotated/core";
import { EntitySummaryProps } from "./EntitySummaryProps.ts";
import { Any } from "../utils/Any.ts";
import {
  AnnoRepoAnnotation,
  AnnoRepoBodyBase,
  PageBody,
} from "./AnnoRepoAnnotation.ts";
import { Language, LanguageCode } from "./Language.ts";
import {
  BrederodeSearchResultsBody,
  FacetName,
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
import { ArtworkSections } from "../projects/kunstenaarsbrieven/annotation/ProjectAnnotationModel.ts";
import { GetBlockType } from "../components/Text/Annotated/core/AnnotationModel.ts";
import { SearchHitLocation } from "../components/Text/Annotated/utils/resolveSearchHits.ts";
import {
  Artwork,
  PersonTeiRef,
} from "../projects/kunstenaarsbrieven/annotation/ProjectAnnotationModel.ts";

export type PanelRegion = "left" | "main" | "right";
export type DetailPanelConfig = {
  name: string;
  visible: boolean;
  size: string;
  region: PanelRegion;
  disabled: boolean;
  /** Prefer this panel when its region on a small screen (phone). */
  preferOnNarrow?: boolean;
  panel: {
    content: JSX.Element;
  };
};

export type ProjectConfig = SearchConfig &
  AnnotationConfig &
  TextConfig &
  FacsimileConfig & {
    id: string;
    version: string;
    versionHash: string;
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
    showHighlightsTab: boolean;
    personsUrl: string;
    artworksUrl: {
      key: ArtworkSections;
      url: string;
    }[];
    biblUrl: Partial<Record<LanguageCode, string>>;
    menuUrl: string;
    letterIdUrl: string;
    letterIdFormat: LetterIdFormat;
    homeUrl: string;
    locationUrl: string;
    siteTitle: string;
    favicon: string;
    pageLabelFormat: (pageBody: PageBody) => string | undefined;
    buildNavLink: (target: string, projectName: string) => string;

    detailPanels: DetailPanelConfig[];

    components: ComponentsConfig;

    routes: {
      path: string;
      element: JSX.Element;
    }[];
    homePage: JSX.Element | null;
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
  EntitySummaryDetails: (props: {
    entityBody: PersonTeiRef | Artwork;
    entityCategory: string;
  }) => JSX.Element;
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
  /** Lists the search hits; see {@link ProjectConfig.searchHitLocations} */
  HighlightsPanel: () => JSX.Element;
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
    order?: "keyAsc" | "keyDesc";
    size?: number;
  }[];
  overrideDefaultSearchParams: Partial<SearchParams>;
  allowEmptyStringSearch: boolean;
  showFacetFilter: boolean;
  searchSorting: { name: string; value: string }[];
  viewsToSearchIn: string[];
  showSearchInTextViews: boolean;
  // This is only used for sorting the search results.
  // Kunstenaarsbrieven projects have a more complex 'date' facet that includes lte and gte,
  // meaning it can't be used for sorting. Those projects have an extra 'dateSorting'.
  // That object can be used for sorting, but not as a date facet.
  dateFacetSorting: string;
};

/**
 * Should a marker be postfixed or prefixed to block elements?
 */
export type MarkerPosition = "postfix" | "prefix";

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
  annotatedTextComponents: AnyAnnotatedTextComponents;

  blockSchema: BlockSchema;

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
  getMarkerPosition: (body: AnnoRepoBodyBase) => MarkerPosition;

  isBlock: (body: AnnoRepoBodyBase) => boolean;
  getBlockType: GetBlockType<AnnoRepoBodyBase>;

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

  /**
   * Sidebar tab to open when no tab is selected yet.
   * Default: the toc tab when {@link ProjectConfig.showToc}, else metadata.
   */
  getDefaultSidebarTab?: (annotations: AnnoRepoAnnotation[]) => string;

  filterPanels?: (
    panels: DetailPanelConfig[],
    annotations: AnnoRepoAnnotation[],
  ) => string[];

  getEntityFacetValues?: (
    body: AnnoRepoBodyBase,
  ) => Record<FacetName, string[]>;

  /**
   * Ordered list of places a search hit can be revealed and scrolled to,
   * paired with the text view each renders. Order is reading order: hits are
   * listed location by location, and the first is revealed on load. Setting
   * it turns on collecting hits — entity matches (when
   * {@link ProjectConfig.getEntityFacetValues} is set too) and full-text hits —
   * which {@link ProjectConfig.showHighlightsTab} lists.
   */
  searchHitLocations?: SearchHitLocation[];

  /**
   * The panel holding the element a url hash points at, for hashes the detail
   * view should reveal, scroll to and highlight on load — such as a paragraph
   * linked to from another letter. Undefined leaves the hash to the ToC.
   */
  getHashTargetPanel?: (hash: string) => string | undefined;
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

/**
 * How the letter ids listed at {@link ProjectConfig.letterIdUrl} relate to the
 * urns used in detail urls, to the letter numbers as cited, and to what a user
 * types in the quick search. Every project spells these differently:
 * Van Gogh id 'rm01' is cited as 'RM01' and lives at urn '...:vangogh:RM01',
 * Mechteld van Gelre id '010' is cited as '010' and lives at '...:brief_010'.
 *
 * The default is identity for all three; projects override what differs.
 */
export type LetterIdFormat = {
  /** Letter id to the part of the urn after the project id, e.g. '010' -> 'brief_010' */
  toUrnSuffix: (letterId: string) => string;
  /** Letter id to the letter number as cited, e.g. 'rm01' -> 'RM01' */
  toNumber: (letterId: string) => string;
  /** Quick search input to letter id, e.g. '1' -> '001' */
  fromInput: (input: string) => string;
};

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
