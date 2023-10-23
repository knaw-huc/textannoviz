import { AnnoRepoAnnotation } from "./AnnoRepoAnnotation";

export type ProjectConfig = {
  id: string;
  broccoliUrl: string;
  colours: Record<string, string>;
  relativeTo: string;
  annotationTypesToInclude: string[];
  annotationTypesTitles?: Record<string, string>;
  tier: string[];
  bodyType: string[];
  scanAnnotation?: string;
  documents?: {
    docNr: string;
    index: number[];
  }[];
  letters?: string[];
  elasticIndexName?: string;
  initialDateFrom?: string;
  initialDateTo?: string;
  searchFacetTitles?: Record<string, string>;
  textPanelTitles?: Record<string, string>;
  allPossibleTextPanels?: string[];
  defaultTextPanels?: string[];
  metadataPanelTitles?: Record<string, string>;
  facetsTranslation?: Record<string, string>;
  showSearchSortBy: boolean;
  showSearchResultsButtonFooter: boolean;
  showFacsimileButtonFooter: boolean;
  defaultShowMetadataPanel: boolean;
  showToggleTextPanels: boolean;
  zoomAnnoMirador: boolean;
  annotationTypesToZoom?: string[];
  logoImageUrl: string;
  headerTitle: string;
  logoHref: string;
  showSearchQueryHistory: boolean;
  showDateFacets: boolean;
  showKeywordFacets: boolean;
  showSelectedFilters: boolean;
  renderAnnotationItem: (annotation: AnnoRepoAnnotation) => string | undefined;
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
};
