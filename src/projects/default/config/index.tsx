import {ProjectConfig} from "../../../model/ProjectConfig.ts";
import {englishLabels} from "./englishLabels.ts";
import {Placeholder} from "../../../components/Placeholder.tsx";

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
  bodyType: [],
  allPossibleTextPanels: ["self"],
  defaultTextPanels: ["self"],
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
    AnnotationItem: Placeholder,
    AnnotationItemContent: Placeholder,
    AnnotationLinks: Placeholder,
    AnnotationButtons: Placeholder,
    Help: Placeholder,
    MetadataPanel: Placeholder,
    SearchInfoPage: Placeholder
  },
  selectedLanguage: 'en',
  languages: [{
    code: 'en', labels: englishLabels
  }],
  mirador: {
    showWindowSideBar: false,
    showTopMenuButton: false,
  },
};
