import {
  AnnotationBodyId,
  AnnotationSegment,
  RelativeTextAnnotation,
  Segment,
} from "../Model.ts";

export function createAnnotationClasses(
  segment: Segment,
  annotationSegment: AnnotationSegment,
  annotation: RelativeTextAnnotation,
  hoveringOn: AnnotationBodyId | undefined,
) {
  const isSearchHighlight = annotation.type === "search";

  const classes = [`id-${annotation.id.replaceAll(":", "-")}`];
  if (annotation.type === "Entity") {
    classes.push(`underlined-${annotation.category}`);
  }
  if (!isSearchHighlight) {
    classes.push("nested-annotation", "cursor-pointer");
  }
  if (isSearchHighlight) {
    classes.push("search-highlight", "bg-yellow-200 rounded");
  }
  if (hoveringOn === annotation.id) {
    classes.push("hover-underline");
  }
  if (segment.index === annotationSegment.startSegment) {
    classes.push("start-annotation");
  }
  if (segment.index === annotationSegment.endSegment - 1) {
    classes.push("end-annotation");
  }
  return classes.join(" ").toLowerCase();
}
