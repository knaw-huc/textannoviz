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
  | "initialRangeFrom"
  | "initialRangeTo"
  | "maxRange"
  | "logoImageUrl"
  | "relativeTo"
  | "headerColor"
> = {
  broccoliUrl: "https://broccoli.tt.di.huc.knaw.nl",
  colours: {},
  showAnnotations: false,
  annotationTypesToInclude: [],
  annotationTypesToHighlight: [],
  allowedAnnotationTypesToHighlight: [],
  allPossibleTextPanels: ["self"],
  defaultTextPanels: ["self"],
  showSearchSortBy: true,
  showFacsimileButtonFooter: false,
  showSearchResultsButtonFooter: false,
  showSettingsMenuFooter: false,
  defaultShowMetadataPanel: true,
  showToggleTextPanels: false,
  zoomAnnoMirador: false,
  logoHref: "/",
  showSearchQueryHistory: true,
  showDateFacets: true,
  showKeywordFacets: true,
  showSliderFacets: false,
  showSelectedFilters: true,
  showNewSearchButton: true,
  allowCloseTextPanel: true,
  showWebAnnoTab: true,
  showHistogram: false,
  useExternalConfig: false,
  visualizeAnnosMirador: false,
  allowEmptyStringSearch: true,
  showMirador: true,
  showMiradorNavigationButtons: false,
  showInputFacet: false,
  histogramFacet: "",
  inputFacetOptions: "",
  overrideDefaultAggs: [],
  defaultKeywordAggsToRender: [],
  showFacetFilter: true,
  components: {
    AnnotationItem: AnnotationItem,
    AnnotationItemContent: AnnotationItemContent,
    AnnotationLinks: Placeholder,
    AnnotationButtons: Empty,
    Help: Placeholder,
    MetadataPanel: Placeholder,
    SearchInfoPage: Placeholder,
    SearchItem: SearchItem,
    EntityMetadata: Empty,
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
