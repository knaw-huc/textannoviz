import { AnnotationSegment, Segment } from "../core";
import { ProjectConfig } from "../../../../model/ProjectConfig.ts";

export function createStartEndClasses(
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

export function normalizeClassname(annotationCategory: string) {
  return annotationCategory.toLowerCase().replaceAll(":", "-");
}

const unknownCategory = "UNKNOWN";

export function createTooltipMarkerClasses(): string[] {
  return ["marker", "cursor-help"].map(normalizeClassname);
}

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
