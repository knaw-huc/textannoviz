import { LineText } from "./LineText.tsx";
import { AnnotationBodyId, RelativeTextAnnotation, Segment } from "./Model.ts";
import { createAnnotationClasses } from "./utils/createAnnotationClasses.ts";

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
    (a) => a.id === annotationSegment.id,
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
