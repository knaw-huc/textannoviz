import {AnnoRepoAnnotation} from "./AnnoRepoAnnotation.ts";

export type ProjectConfig = {
  id: string;
  broccoliUrl: string;
  colours: Record<string, string>;

  /**
   * Offsets relative to the closest annotation of type {relativeTo}
   * - AnnoRepo finds closest annotation
   * - Broccoli calculates offsets
   */
  relativeTo: string;

  annotationTypesToInclude: string[];
  annotationTypesTitles?: Record<string, string>;
  tier: string[];
  bodyType: string[];
  scanAnnotation: string;
  elasticIndexName: string;
  initialDateFrom: string;
  initialDateTo: string;
  searchFacetTitles?: Record<string, string>;
  textPanelTitles: Record<string, string>;
  allPossibleTextPanels: string[];
  defaultTextPanels: string[];
  // TODO translate:
  metadataPanelTitles?: Record<string, string>;
  facetsTranslation?: Record<string, string>;
  showSearchSortBy: boolean;
  showSearchResultsButtonFooter: boolean;
  showFacsimileButtonFooter: boolean;
  defaultShowMetadataPanel: boolean;
  showToggleTextPanels: boolean;
  zoomAnnoMirador: boolean;
  annotationTypesToZoom: string[];
  logoImageUrl: string;
  headerTitle: string;
  logoHref: string;
  showSearchQueryHistory: boolean;
  showDateFacets: boolean;
  showKeywordFacets: boolean;
  showSelectedFilters: boolean;
  renderAnnotationItemContent: (annotation: AnnoRepoAnnotation) => JSX.Element;
  renderAnnotationLinks?: () => JSX.Element;
  renderAnnotationButtons: (
      nextOrPrevButtonClicked: (clicked: boolean) => boolean,
  ) => JSX.Element;
  renderMetadataPanel: (annotations: AnnoRepoAnnotation[]) => JSX.Element;
  createRouter: (
      comp1: React.ReactNode,
      comp2: React.ReactNode,
      comp3: React.ReactNode,
      errorComp: React.ReactNode,
  ) => {
    path: string;
    element: React.ReactNode;
    errorElement: React.ReactNode;
  }[];
  renderHelp: () => JSX.Element;
  renderSearchInfoPage: () => JSX.Element;
  labels: Record<string, string>;
  mirador: {
    showWindowSideBar: boolean,
    showTopMenuButton: boolean
  },
  components: {
    AnnotationItem: (props: { annotation: AnnoRepoAnnotation }) => JSX.Element
  }
};
