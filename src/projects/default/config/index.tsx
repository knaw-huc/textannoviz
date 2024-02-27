import { Empty } from "../../../components/Empty.tsx";
import { Placeholder } from "../../../components/Placeholder.tsx";
import { ProjectConfig } from "../../../model/ProjectConfig.ts";
import { AnnotationItem } from "../AnnotationItem.tsx";
import { AnnotationItemContent } from "../AnnotationItemContent.tsx";
import { SearchItem } from "../SearchItem.tsx";
import { englishLabels } from "./englishLabels.ts";

/**
 * Default configuration file with some sensible defaults
 * which can be extended and overwritten by projects
 */
export const defaultConfig: Omit<
  ProjectConfig,
  | "id"
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
  annotationTypesToHighlight: [],
  allowedAnnotationTypesToHighlight: [],
  tier: [],
  bodyType: [],
  allPossibleTextPanels: ["self"],
  defaultTextPanels: ["self"],
  showSearchSortBy: true,
  showFacsimileButtonFooter: false,
  showSearchResultsButtonFooter: false,
  showSettingsMenuFooter: false,
  defaultShowMetadataPanel: true,
  showToggleTextPanels: false,
  zoomAnnoMirador: false,
  annotationTypesToZoom: [],
  logoHref: "/",
  showSearchQueryHistory: true,
  showDateFacets: true,
  showKeywordFacets: true,
  showSelectedFilters: true,
  showNewSearchButton: true,
  allowCloseTextPanel: true,
  showWebAnnoTab: true,
  showHistogram: false,
  useExternalConfig: false,
  visualizeAnnosMirador: false,
  histogramFacet: "",
  components: {
    AnnotationItem: AnnotationItem,
    AnnotationItemContent: AnnotationItemContent,
    AnnotationLinks: Placeholder,
    AnnotationButtons: Empty,
    Help: Placeholder,
    MetadataPanel: Placeholder,
    SearchInfoPage: Placeholder,
    SearchItem: SearchItem,
  },
  selectedLanguage: "en",
  languages: [
    {
      code: "en",
      labels: englishLabels,
    },
  ],
  mirador: {
    showWindowSideBar: false,
    showTopMenuButton: false,
  },
};
