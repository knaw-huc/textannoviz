import {
  AnnotationSegment,
  MarkerSegment,
  NestedAnnotationSegment,
  SearchHighlightSegment,
  Segment,
} from "../AnnotationModel.ts";
import { Any } from "../../../../utils/Any.ts";
import { EntityCategoryGetter } from "../../../../model/ProjectConfig.ts";

export function createAnnotationClasses(
  segment: Segment,
  annotation: NestedAnnotationSegment,
  entityTypes: string[],
  getEntityCategory: EntityCategoryGetter,
) {
  const classes = [];
  classes.push(
    "nested-annotation",
    annotation.body.id,
    "cursor-pointer",
    "depth-" + annotation.depth,
  );
  if (entityTypes.includes(annotation.body.type)) {
    const category = getEntityCategory(annotation.body);
    classes.push(toEntityClassname(category));
  }
  classes.push(...createStartEndClasses(segment, annotation));
  return classes.join(" ").toLowerCase();
}

export function createSearchHighlightClasses(
  annotationSegment: SearchHighlightSegment,
  segment: Segment,
) {
  const classes = [];
  classes.push("search-highlight", "bg-yellow-200 rounded");
  classes.push(...createStartEndClasses(segment, annotationSegment));
  return classes.join(" ");
}

export function createTooltipMarkerClasses(marker: MarkerSegment) {
  const classes = [];
  classes.push("marker", "cursor-help", marker.body.id);
  return classes.join(" ");
}

function createStartEndClasses(
  segment: Segment,
  annotationSegment: AnnotationSegment,
): string[] {
  const classes = [];
  if (segment.index === annotationSegment.startSegment) {
    classes.push("start-annotation");
  }
  if (segment.index === annotationSegment.endSegment - 1) {
    classes.push("end-annotation");
  }
  return classes;
}

const dataToEntityCategory = {
  COM: "COM",
  DAT: "DAT",
  HOE: "HOE",
  LOC: "LOC",
  ORG: "ORG",

  /**
   * PER can also be named PERS
   */
  PER: "PER",
  PERS: "PER",
} as Any;

const unknownCategory = "UNKNOWN";

export function toEntityClassname(annotationCategory?: string) {
  return `underlined-${normalizeEntityCategory(
    annotationCategory,
  ).toLowerCase()}`;
}

export function normalizeEntityCategory(annotationCategory?: string) {
  if (!annotationCategory) {
    return unknownCategory;
  }
  return dataToEntityCategory[annotationCategory] ?? unknownCategory;
}
