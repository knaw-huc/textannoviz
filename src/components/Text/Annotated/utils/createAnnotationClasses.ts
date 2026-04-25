import { AnnotationSegment, Segment } from "../core";
import { ProjectConfig } from "../../../../model/ProjectConfig.ts";
import { Offsets } from "@knaw-huc/text-annotation-segmenter";

export function createStartEndClasses(
  segment: Segment,
  annotationSegment: AnnotationSegment,
  offsets?: Offsets,
): string[] {
  const classes = [];
  if (isStartOfAnnotation(segment, annotationSegment, offsets)) {
    classes.push("start-annotation");
  }
  if (isEndOfAnnotation(segment, annotationSegment, offsets)) {
    classes.push("end-annotation");
  }
  return classes.map(normalizeClassname);
}

function isStartOfAnnotation(
  segment: Segment,
  annotation: AnnotationSegment,
  offsets?: Offsets,
): boolean {
  if (segment.index === annotation.startSegment) {
    return true;
  }
  if (!offsets) {
    return false;
  }
  // When an annotation was split by a block, re-start annotation in second block:
  const isFirstSegmentInGroup = segment.index === offsets.begin;
  const isAnnotationStartedBeforeGroup =
    annotation.startSegment < offsets.begin;
  return isFirstSegmentInGroup && isAnnotationStartedBeforeGroup;
}

function isEndOfAnnotation(
  segment: Segment,
  annotation: AnnotationSegment,
  offsets?: Offsets,
): boolean {
  if (segment.index === annotation.endSegment - 1) {
    return true;
  }
  if (!offsets) {
    return false;
  }
  // When an annotation was split by a block, also end annotation in first block:
  const isLastSegmentInGroup = segment.index === offsets.end - 1;
  const isAnnotationEndingAfterGroup = annotation.endSegment > offsets.end;
  return isLastSegmentInGroup && isAnnotationEndingAfterGroup;
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
