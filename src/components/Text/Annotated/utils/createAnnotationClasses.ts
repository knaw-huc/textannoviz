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
  getAnnotationHighlightCategory: CategoryGetter,
): string[] {
  const classes: string[] = [];
  const body = annotationSegment.body;
  if (isSearchHighlightBody(body)) {
    classes.push("bg-yellow-200", "rounded");
  } else if (isAnnotationHighlightBody(body)) {
    classes.push(`highlight-${getAnnotationHighlightCategory(body)}`);
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
  if (segment.index === annotationSegment.startSegment) {
    classes.push("start-annotation");
  }
  if (segment.index === annotationSegment.endSegment - 1) {
    classes.push("end-annotation");
  }
  return classes.map(normalizeClassname);
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
  return `annotated-${normalizeEntityCategory(annotationCategory)}`;
}

export function normalizeEntityCategory(annotationCategory?: string) {
  if (!annotationCategory) {
    return unknownCategory;
  }
  const entityCategory =
    dataToEntityCategory[annotationCategory] ?? unknownCategory;
  return normalizeClassname(entityCategory);
}

export function normalizeClassname(annotationCategory: string) {
  return annotationCategory.toLowerCase().replace(":", "-");
}
