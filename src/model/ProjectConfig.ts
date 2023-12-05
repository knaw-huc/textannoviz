import { AnnoRepoAnnotation } from "./AnnoRepoAnnotation.ts";
import { Language, LanguageCode } from "./Language.ts";

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
  tier: string[];
  bodyType: string[];
  scanAnnotation: string;
  elasticIndexName: string;
  initialDateFrom: string;
  initialDateTo: string;
  allPossibleTextPanels: string[];
  defaultTextPanels: string[];
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
  showNewSearchButton: boolean;
  selectedLanguage: LanguageCode;
  languages: Language[];
  mirador: {
    showWindowSideBar: boolean;
    showTopMenuButton: boolean;
  };
  components: {
    AnnotationButtons: (props: {
      nextOrPrevButtonClicked: (clicked: boolean) => boolean;
    }) => JSX.Element;
    AnnotationItem: (props: AnnotationItemProps) => JSX.Element;
    AnnotationItemContent: (props: {
      annotation: AnnoRepoAnnotation;
    }) => JSX.Element;
    AnnotationLinks: () => JSX.Element | null;
    Help: () => JSX.Element;
    MetadataPanel: (props: {
      annotations: AnnoRepoAnnotation[];
    }) => JSX.Element;
    SearchInfoPage: () => JSX.Element;
  };
};

export type AnnotationItemProps = { annotation: AnnoRepoAnnotation };
