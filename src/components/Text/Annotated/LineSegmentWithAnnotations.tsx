import _ from "lodash";
import {
  NestedAnnotation,
  NestedAnnotationProps,
} from "./NestedAnnotation.tsx";
import {
  AnnotationBodyId,
  AnnotationSegmentWithBodyAndOffsets,
  isNestedAnnotationSegment,
} from "./AnnotationModel.ts";

export type LineSegmentWithAnnotationsProps = Omit<
  NestedAnnotationProps,
  "depthCorrection" | "toNest"
> & {
  onHoverChange: (value: AnnotationBodyId | undefined) => void;
};

export function LineSegmentWithAnnotations(
  props: LineSegmentWithAnnotationsProps,
) {
  let depthCorrection = 0;
  let selectOnHover: AnnotationSegmentWithBodyAndOffsets | undefined =
    undefined;

  const nestedAnnotations = props.segment.annotations.filter(
    isNestedAnnotationSegment,
  );
  if (nestedAnnotations.length) {
    const groupMaxDepth = nestedAnnotations[0].group.maxDepth;
    const segmentMaxDepth = _.maxBy(nestedAnnotations, "depth")?.depth ?? 0;
    depthCorrection = groupMaxDepth - segmentMaxDepth;
    selectOnHover = nestedAnnotations.at(-1);
  }

  return (
    <span
      className="annotated-segment"
      onMouseOver={() => props.onHoverChange(selectOnHover?.body.id)}
      onMouseLeave={() => props.onHoverChange(undefined)}
    >
      <NestedAnnotation
        {...props}
        toNest={nestedAnnotations}
        depthCorrection={depthCorrection}
      />
    </span>
  );
}
