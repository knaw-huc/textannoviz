import {
  AnnotationBodyId,
  AnnotationSegment,
  NestedAnnotationSegment,
  SearchHighlightAnnotationSegment,
  Segment,
} from "../AnnotationModel.ts";

export function createAnnotationClasses(
  segment: Segment,
  annotation: NestedAnnotationSegment,
  hoveringOn: AnnotationBodyId | undefined,
) {
  const classes = [];
  classes.push("nested-annotation", "cursor-pointer");
  if (annotation.body.type === "Entity") {
    classes.push(`underlined-${annotation.body.metadata.category}`);
  }
  if (hoveringOn === annotation.body.id) {
    classes.push("hover-underline");
  }
  classes.push(...createStartEndClasses(segment, annotation));
  return classes.join(" ").toLowerCase();
}

export function createSearchHighlightClasses(
  annotationSegment: SearchHighlightAnnotationSegment,
  segment: Segment,
) {
  const classes = [];
  classes.push("search-highlight", "bg-yellow-200 rounded");
  classes.push(...createStartEndClasses(segment, annotationSegment));
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
