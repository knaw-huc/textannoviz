import { LineText } from "./LineText.tsx";
import {
  AnnotationBodyId,
  RelativeTextAnnotation,
} from "../RelativeTextAnnotation.ts";
import { SegmentedLine } from "./Model.ts";

export type NestedAnnotationProps = {
  segment: SegmentedLine;
  annotations: RelativeTextAnnotation[];
  depthCorrection: number;
  hoveringOn: AnnotationBodyId | undefined;
};

export function NestedAnnotation(props: NestedAnnotationProps) {
  const segmentAnnotations = props.segment.annotations;
  const toRender = segmentAnnotations[0];
  const toNest = segmentAnnotations.slice(1);
  const annotation = props.annotations.find(
    (a) => a.anno.body.id === toRender.id,
  );
  if (!annotation) {
    throw new Error(
      `No annotation found for segment annotation id ${toRender.id}`,
    );
  }
  return (
    <span className={createAnnotationClasses(annotation, props.hoveringOn)}>
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
  return classes.join(" ").toLowerCase();
}
