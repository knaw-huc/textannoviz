import {ProjectConfig} from "../../../model/ProjectConfig.ts";
import {englishLabels} from "./englishLabels.ts";

/**
 * Default configuration file with some sensible defaults
 * which can be extended and overwritten by projects
 */
export const defaultConfig: Omit<ProjectConfig,
    "id"
    | "elasticIndexName"
    | "headerTitle"
    | "initialDateFrom"
    | "initialDateTo"
    | "logoImageUrl"
    | "relativeTo"
    | "scanAnnotation"
> = {
  broccoliUrl: "https://broccoli.tt.di.huc.knaw.nl",
  colours: {},
  annotationTypesToInclude: [],
  tier: [],
  annotationTypesTitles: {},
  bodyType: [],
  searchFacetTitles: {},
  textPanelTitles: {},
  allPossibleTextPanels: ["self"],
  defaultTextPanels: ["self"],
  facetsTranslation: {},
  showSearchSortBy: true,
  showFacsimileButtonFooter: true,
  showSearchResultsButtonFooter: true,
  defaultShowMetadataPanel: true,
  showToggleTextPanels: false,
  zoomAnnoMirador: true,
  annotationTypesToZoom: [],
  logoHref: "/",
  showSearchQueryHistory: true,
  showDateFacets: true,
  showKeywordFacets: true,
  showSelectedFilters: true,
  components: {
    AnnotationItem: () => <></>,
    AnnotationItemContent: () => <></>,
    AnnotationLinks: () => <></>,
    AnnotationButtons: () => <></>,
    Help: () => <></>,
    MetadataPanel: () => <></>,
    SearchInfoPage: () => <></>
  },
  labels: englishLabels,
  mirador: {
    showWindowSideBar: false,
    showTopMenuButton: false,
  },
};
