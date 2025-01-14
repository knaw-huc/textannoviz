import merge from "lodash/merge";
import logo from "../../../assets/logo-republic-temp.png";
import {
  ProjectConfig,
  ProjectSpecificConfig,
} from "../../../model/ProjectConfig";
import { defaultConfig } from "../../default/config";
import { MetadataPanel } from "../MetadataPanel";
import "../project.css";
import { SearchItem } from "../SearchItem";
import { dutchTranslatinLabels } from "./dutchTranslatinLabels";

import {
  getAnnotationCategory,
  getHighlightCategory,
  isEntity,
  projectEntityTypes,
  projectHighlightedTypes,
  projectInsertTextMarkerAnnotationTypes,
  projectPageMarkerAnnotationTypes,
  projectTooltipMarkerAnnotationTypes,
} from "../annotation/ProjectAnnotationModel.ts";

export const translatinConfig: ProjectConfig = merge({}, defaultConfig, {
  id: "translatin",
  relativeTo: "tl:Manifestation",
  annotationTypesToInclude: [
    // "pagexml:Line",
    // "pagexml:Page",
    // "pagexml:Region",
    "tl:Manifestation",
    "tei:Hi",
    "tei:Head",
    "tei:Metamark",
    "tei:Milestone",
  ],

  showAnnotations: true,
  annotationTypesToHighlight: [],
  entityAnnotationTypes: projectEntityTypes,
  highlightedAnnotationTypes: projectHighlightedTypes,
  tooltipMarkerAnnotationTypes: projectTooltipMarkerAnnotationTypes,
  pageMarkerAnnotationTypes: projectPageMarkerAnnotationTypes,
  insertTextMarkerAnnotationTypes: projectInsertTextMarkerAnnotationTypes,

  getAnnotationCategory: getAnnotationCategory,
  getHighlightCategory: getHighlightCategory,
  isEntity: isEntity,

  elasticIndexName: "manifestations",
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
    MetadataPanel,
    SearchItem,
  },

  selectedLanguage: "nl",
  languages: [{ code: "nl", labels: dutchTranslatinLabels }],
} as ProjectSpecificConfig);
