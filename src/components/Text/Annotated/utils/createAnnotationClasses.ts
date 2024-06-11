import {
  AnnotationBodyId,
  AnnotationOffsets,
  AnnotationSegment,
  SearchHighlightAnnotationSegment,
  Segment,
} from "../Model.ts";

export function createAnnotationClasses(
  segment: Segment,
  annotationSegment: AnnotationSegment,
  annotation: AnnotationOffsets,
  hoveringOn: AnnotationBodyId | undefined,
) {
  const classes = [`id-${annotation.id.replaceAll(":", "-")}`];
  if (annotation.type === "Entity") {
    classes.push(`underlined-${annotation.category}`);
  }
  classes.push("nested-annotation", "cursor-pointer");
  if (hoveringOn === annotation.id) {
    classes.push("hover-underline");
  }
  classes.push(...createStartEndClasses(segment, annotationSegment));
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
  annotationSegment: SearchHighlightAnnotationSegment,
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
