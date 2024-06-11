import _ from "lodash";
import { NestedAnnotation } from "./NestedAnnotation.tsx";
import { LineSegmentProps } from "./LineSegment.tsx";

export type LineSegmentWithAnnotationsProps = LineSegmentProps;

export function LineSegmentWithAnnotations(
  props: LineSegmentWithAnnotationsProps,
) {
  const groupMaxDepth = props.segment.annotations[0].depth;
  const segmentMaxDepth =
    _.maxBy(props.segment.annotations, "depth")?.depth ?? 0;
  const depthCorrection = groupMaxDepth - segmentMaxDepth;

  const selectOnHover = props.segment.annotations.at(-1);
  if (!selectOnHover) {
    throw new Error("No annotation to select on hover");
  }
  return (
    <span
      className="annotated-segment"
      onMouseOver={() => props.onHoverChange(selectOnHover.id)}
      onMouseLeave={() => props.onHoverChange(undefined)}
    >
      <NestedAnnotation {...props} depthCorrection={depthCorrection} />
    </span>
  );
}
