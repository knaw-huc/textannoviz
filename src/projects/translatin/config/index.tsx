import merge from "lodash/merge";
import logo from "../../../assets/logo-translatin-transp.png";
import {
  ProjectConfig,
  ProjectSpecificConfig,
} from "../../../model/ProjectConfig";
import { defaultConfig } from "../../default/config";
import { SearchItem } from "../SearchItem";
import { dutchTranslatinLabels } from "./dutchTranslatinLabels";
import { projectHighlightedTypes } from "../annotation/ProjectAnnotationModel.ts";
import projectCss from "../project.css?inline";
import { isHighlightBody } from "../../../model/AnnoRepoAnnotation.ts";
import { MetadataPanel } from "../MetadataPanel.tsx";

export const translatinConfig: ProjectConfig = merge({}, defaultConfig, {
  id: "translatin",
  relativeTo: "Document",
  broccoliUrl: "http://localhost:8082",
  annotationTypesToInclude: [
    "Document",
    ...projectHighlightedTypes,
    // TODO: what other types to render?
    // "Dataset",
    // "Division",
    // "Head",
    // "Highlight",
    // "List",
    // "ListItem",
    // "Note",
    // "Page",
    // "Paragraph",
    // "Quote",
    // "Reference",
  ],
  elasticIndexName: "translatin",
  initialDateFrom: "1500-01-01",
  initialDateTo: "1800-01-01",
  initialRangeFrom: "0",
  initialRangeTo: "30000",
  maxRange: 30000,
  logoImageUrl: logo,
  headerColor: "bg-brand1-700 text-brand1-100",
  headerTitle: "",
  showSearchResultsButtonFooter: false,
  showMirador: false,
  showAnnotations: true,
  components: {
    // TODO:
    MetadataPanel,
    // MetadataPanel: Empty,
    SearchItem,
  },
  highlightedAnnotationTypes: projectHighlightedTypes,

  selectedLanguage: "nl",
  languages: [{ code: "nl", labels: dutchTranslatinLabels }],

  viewsToSearchIn: ["playText"],
  showSearchInTextViews: true,

  getHighlightCategory: (body) =>
    isHighlightBody(body) ? body.style : body.type,
  getAnnotationCategory: (anno) => anno.type,
  projectCss: projectCss,
} as ProjectSpecificConfig);
