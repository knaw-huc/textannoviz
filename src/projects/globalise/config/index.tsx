import * as _ from "lodash";
import logo from "../../../assets/G-1.png";
import { ProjectConfig } from "../../../model/ProjectConfig.ts";
import { defaultConfig } from "../../default/config";
import { AnnotationButtons } from "../AnnotationButtons.tsx";
import AnnotationItem from "../AnnotationItem.tsx";
import { AnnotationItemContent } from "../AnnotationItemContent.tsx";
import { Help } from "../Help.tsx";
import { MetadataPanel } from "../MetadataPanel.tsx";
import { SearchInfoPage } from "../SearchInfoPage.tsx";
import { SearchItem } from "../SearchItem.tsx";
import { englishGlobaliseLabels } from "./englishGlobaliseLabels.ts";

export const globaliseConfig: ProjectConfig = _.merge({}, defaultConfig, {
  id: "globalise",
  broccoliUrl: "https://gloccoli.tt.di.huc.knaw.nl",
  colours: {
    textregion: "white",
    textline: "#DB4437",
    entity: "green",
  },
  relativeTo: "na:File",
  annotationTypesToInclude: ["px:Page"],
  // annotationTypesToHighlight: ["px:Page"],
  // allowedAnnotationTypesToHighlight: ["px:Page"],
  scanAnnotation: "na:File",
  elasticIndexName: "docs",
  initialDateFrom: "1500-01-01",
  initialDateTo: "1800-01-01",
  showSearchSortBy: false,
  showFacsimileButtonFooter: false,
  showSearchResultsButtonFooter: false,
  defaultShowMetadataPanel: false,
  logoImageUrl: logo,
  headerTitle: "GLOBALISE Transcriptions Viewer",
  logoHref: "https://globalise.huygens.knaw.nl",
  showSearchQueryHistory: false,
  showDateFacets: false,
  showKeywordFacets: false,
  showSelectedFilters: false,
  showNewSearchButton: false,
  allowCloseTextPanel: false,
  components: {
    AnnotationButtons,
    AnnotationItem,
    AnnotationItemContent,
    Help,
    MetadataPanel,
    SearchInfoPage,
    SearchItem,
  },
  selectedLanguage: "en",
  languages: [
    {
      code: "en",
      labels: englishGlobaliseLabels,
    },
  ],
  mirador: {
    showWindowSideBar: true,
  },
});
