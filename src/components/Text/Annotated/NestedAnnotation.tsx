import { LineText } from "./LineText.tsx";
import {
  AnnotationBodyId,
  AnnotationSegment,
  RelativeTextAnnotation,
  Segment,
} from "./Model.ts";

export type NestedAnnotationProps = {
  segment: Segment;
  annotations: RelativeTextAnnotation[];
  depthCorrection: number;
  hoveringOn: AnnotationBodyId | undefined;
};

export function NestedAnnotation(props: NestedAnnotationProps) {
  const segmentAnnotations = props.segment.annotations;
  const annotationSegment = segmentAnnotations[0];
  const toNest = segmentAnnotations.slice(1);
  const annotation = props.annotations.find(
    (a) => a.anno.body.id === annotationSegment.id,
  );
  if (!annotation) {
    throw new Error(
      `No annotation found for segment annotation id ${annotationSegment.id}`,
    );
  }
  return (
    <span
      className={createAnnotationClasses(
        props.segment,
        annotationSegment,
        annotation,
        props.hoveringOn,
      )}
    >
      {toNest.length ? (
        <NestedAnnotation
          {...props}
          segment={{ ...props.segment, annotations: toNest }}
        />
      ) : (
        <LineText
          body={props.segment.body}
          depthCorrection={props.depthCorrection}
        />
      )}
    </span>
  );
}

export function createAnnotationClasses(
  segment: Segment,
  annotationSegment: AnnotationSegment,
  annotation: RelativeTextAnnotation,
  hoveringOn: AnnotationBodyId | undefined,
) {
  const classes = [
    `nested-annotation`,
    `underlined-${annotation.anno.body.metadata.category}`,
    `id-${annotation.anno.body.id.replaceAll(":", "-")}`,
  ];
  if (hoveringOn === annotation.anno.body.id) {
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
