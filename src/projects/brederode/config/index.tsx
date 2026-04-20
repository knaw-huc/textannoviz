import merge from "lodash/merge";
import logo from "../../../assets/logo-republic-temp.png";
import {
  ProjectConfig,
  ProjectSpecificConfig,
} from "../../../model/ProjectConfig";
import { defaultConfig } from "../../default/config";
import { defaultAnnotatedTextConfig } from "../../default/annotation/defaultAnnotatedTextConfig";
import { BrederodeMarker } from "../annotation/BrederodeMarker";
import { SearchItem } from "../SearchItem";
import { englishBrederodeLabels } from "./englishBrederodeLabels";
import { MetadataPanel } from "../MetadataPanel";
import { projectPageMarkerAnnotationTypes } from "../annotation/ProjectAnnotationModel";
import { SearchInfoPage } from "../SearchInfoPage";
import { Header } from "../Header";

export const brederodeConfig: ProjectConfig = merge({}, defaultConfig, {
  id: "brederode",
  broccoliUrl: "http://localhost:8082",
  relativeTo: "Letter",
  annotationTypesToInclude: [
    "Dataset",
    "Division",
    "Letter",
    // "Line",
    "Page",
    // "Word",
  ],
  components: {
    SearchItem,
    MetadataPanel,
    SearchInfoPage,
    Header,
  },
  isMarker: (body) => projectPageMarkerAnnotationTypes.includes(body.type),
  elasticIndexName: "brederode",
  showAnnotations: true,
  annotatedTextComponents: {
    ...defaultAnnotatedTextConfig,
    Marker: BrederodeMarker,
  },
  initialDateFrom: "1602-01-01",
  initialDateTo: "1638-01-01",
  initialRangeFrom: "0",
  initialRangeTo: "30000",
  maxRange: 30000,
  logoImageUrl: logo,
  headerColor: "bg-brand1-100 text-brand1-800",
  headerTitle: "The Correspondence of Pieter Cornelisz Brederode (1602–1637)",
  showSearchResultsButtonFooter: false,
  showFacsimile: false,
  useExternalConfig: true,
  showSearchResultsOnInfoPage: true,
  overrideDefaultSearchParams: {
    sortBy: "datePublished",
    sortOrder: "asc",
  },
  defaultKeywordAggsToRender: [
    "sender",
    "recipient",
    "fromLocation",
    "toLocation",
  ],
  viewsToSearchIn: ["letterText"],
  selectedLanguage: "en",
  languages: [{ code: "en", labels: englishBrederodeLabels }],
} as ProjectSpecificConfig);
