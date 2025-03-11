import {
  AnnotationSegment,
  HighlightSegment,
  isAnnotationHighlightBody,
  isSearchHighlightBody,
  MarkerSegment,
  NestedAnnotationSegment,
  Segment,
} from "../AnnotationModel.ts";
import { Any } from "../../../../utils/Any.ts";
import { CategoryGetter } from "../../../../model/ProjectConfig.ts";
import { isStartingSegment } from "./isStartingSegment.ts";

export const SEARCH_HIGHLIGHT = "search-highlight";

export function createAnnotationClasses(
  segment: Segment,
  annotation: NestedAnnotationSegment,
  entityTypes: string[],
  getEntityCategory: CategoryGetter,
): string[] {
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
  return classes.map(normalizeClassname);
}

export function createHighlightClasses(
  annotationSegment: HighlightSegment,
  segment: Segment,
  getHighlightCategory: CategoryGetter,
): string[] {
  const classes: string[] = [];
  const body = annotationSegment.body;
  if (isSearchHighlightBody(body)) {
    classes.push("bg-yellow-200", "rounded");
  } else if (isAnnotationHighlightBody(body)) {
    classes.push(`highlight-${getHighlightCategory(body)}`);
  }
  classes.push(...createStartEndClasses(segment, annotationSegment));
  return classes.map(normalizeClassname);
}

export function createTooltipMarkerClasses(marker: MarkerSegment): string[] {
  const classes = [];
  classes.push("marker", "cursor-help", marker.body.id);
  return classes.map(normalizeClassname);
}

function createStartEndClasses(
  segment: Segment,
  annotationSegment: AnnotationSegment,
): string[] {
  const classes = [];
  if (isStartingSegment(segment, annotationSegment)) {
    classes.push("start-annotation");
  }
  if (isEndingSegment(segment, annotationSegment)) {
    classes.push("end-annotation");
  }
  return classes.map(normalizeClassname);
}

function isEndingSegment(
  segment: Segment,
  annotationSegment: AnnotationSegment,
) {
  return segment.index === annotationSegment.endSegment - 1;
}

// TODO: move to project config
const annoToEntityCategory = {
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
  return normalizeClassname(
    `annotated-${toEntityCategory(annotationCategory)}`,
  );
}

export function toEntityCategory(annotationCategory?: string) {
  if (!annotationCategory) {
    return unknownCategory;
  }
  return annoToEntityCategory[annotationCategory] ?? unknownCategory;
}

export function normalizeClassname(annotationCategory: string) {
  return annotationCategory.toLowerCase().replace(":", "-");
}
