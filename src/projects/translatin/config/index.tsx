import merge from "lodash/merge";
import logo from "../../../assets/logo-republic-temp.png";
import {
  ProjectConfig,
  ProjectSpecificConfig,
} from "../../../model/ProjectConfig";
import { defaultConfig } from "../../default/config";
import { SearchItem } from "../SearchItem";
import { dutchTranslatinLabels } from "./dutchTranslatinLabels";
import { Empty } from "../../../components/Empty.tsx";
import { projectHighlightedTypes } from "../annotation/ProjectAnnotationModel.ts";
import projectCss from "../project.css?inline";

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
  headerColor: "bg-brand1-100 text-brand1-800",
  headerTitle: "TRANSLATIN",
  showSearchResultsButtonFooter: false,
  defaultKeywordAggsToRender: [
    "bodyType",
    "latinTitle",
    "earliest",
    "latest",
    "manifestation",
    "expression",
    "form",
    "formType",
    "title",
    "work",
    "genre",
    "subgenre",
    "author",
    "publisherPlace",
    "publisher",
  ],
  components: {
    // TODO:
    // MetadataPanel,
    MetadataPanel: Empty,
    SearchItem,
  },

  selectedLanguage: "nl",
  languages: [{ code: "nl", labels: dutchTranslatinLabels }],

  showAnnotations: true,
  highlightedAnnotationTypes: projectHighlightedTypes,
  getHighlightCategory: (anno) => anno.type,
  getAnnotationCategory: (anno) => anno.type,
  projectCss: projectCss,
} as ProjectSpecificConfig);
