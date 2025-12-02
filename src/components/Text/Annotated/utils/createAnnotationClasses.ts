import {
  AnnotationSegment,
  HighlightSegment,
  isAnnotationHighlightBody,
  isSearchHighlightBody,
  MarkerSegment,
  NestedAnnotationSegment,
  Segment,
} from "../AnnotationModel.ts";
import {
  CategoryGetter,
  ProjectConfig,
} from "../../../../model/ProjectConfig.ts";

export function createAnnotationClasses(
  segment: Segment,
  annotation: NestedAnnotationSegment,
  entityTypes: string[],
  projectConfig: ProjectConfig,
): string[] {
  const classes = [];
  classes.push(
    "nested-annotation",
    annotation.body.id,
    "cursor-pointer",
    "depth-" + annotation.depth,
  );
  if (entityTypes.includes(annotation.body.type)) {
    const category = projectConfig.getAnnotationCategory(annotation.body);
    classes.push(toEntityClassname(projectConfig, category));
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
  if (segment.index === annotationSegment.startSegment) {
    classes.push("start-annotation");
  }
  if (segment.index === annotationSegment.endSegment - 1) {
    classes.push("end-annotation");
  }
  return classes.map(normalizeClassname);
}

const unknownCategory = "UNKNOWN";

export function toEntityClassname(
  projectConfig: ProjectConfig,
  annotationCategory: string,
) {
  const category = toEntityCategory(projectConfig, annotationCategory);
  return normalizeClassname(`annotated-${category}`);
}

export function toEntityCategory(
  projectConfig: ProjectConfig,
  annotationCategory: string,
) {
  if (!annotationCategory) {
    console.warn(`No annotation category: ${annotationCategory}`);
    return unknownCategory;
  }
  const annoCategory = projectConfig.annoToEntityCategory[annotationCategory];
  if (!annoCategory) {
    console.warn(`Unknown annotation category: ${annotationCategory}`);
    return unknownCategory;
  }
  return annoCategory;
}

export function normalizeClassname(annotationCategory: string) {
  return annotationCategory.toLowerCase().replaceAll(":", "-");
}
