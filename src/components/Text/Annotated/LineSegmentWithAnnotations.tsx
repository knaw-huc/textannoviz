import _ from "lodash";
import {
  NestedAnnotation,
  NestedAnnotationProps,
} from "./NestedAnnotation.tsx";
import { isNestedAnnotationSegment, Segment } from "./AnnotationModel.ts";

export type LineSegmentWithAnnotationsProps = Omit<
  NestedAnnotationProps,
  "depthCorrection" | "toNest"
> & {
  onHoverChange: (value: Segment | undefined) => void;
  onClick: (value: Segment | undefined) => void;
};

export function LineSegmentWithAnnotations(
  props: LineSegmentWithAnnotationsProps,
) {
  let depthCorrection = 0;

  const nestedAnnotations = props.segment.annotations.filter(
    isNestedAnnotationSegment,
  );
  if (nestedAnnotations.length) {
    const groupMaxDepth = nestedAnnotations[0].group.maxDepth;
    const segmentMaxDepth = _.maxBy(nestedAnnotations, "depth")?.depth ?? 0;
    depthCorrection = groupMaxDepth - segmentMaxDepth;
  }

  return (
    <span
      className="annotated-segment"
      onMouseOver={() => props.onHoverChange(props.segment)}
      onMouseLeave={() => props.onHoverChange(undefined)}
      onClick={() => props.onClick(props.segment)}
    >
      <NestedAnnotation
        {...props}
        toNest={nestedAnnotations}
        depthCorrection={depthCorrection}
      />
    </span>
  );
}
