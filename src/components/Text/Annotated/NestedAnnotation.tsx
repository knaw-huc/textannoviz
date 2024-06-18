import {
  AnnotationBodyId,
  AnnotationSegment,
  isNestedAnnotationSegment,
  Segment,
} from "./AnnotationModel.ts";
import { createAnnotationClasses } from "./utils/createAnnotationClasses.ts";
import { SearchHighlightAnnotation } from "./SearchHighlightAnnotation.tsx";
import { DepthCorrection } from "./DepthCorrection.tsx";

export type NestedAnnotationProps = {
  segment: Segment;
  toNest: AnnotationSegment[];
  depthCorrection: number;
  hoveringOn: AnnotationBodyId | undefined;
};

export function NestedAnnotation(props: NestedAnnotationProps) {
  const nestedAnnotations = props.toNest.filter(isNestedAnnotationSegment);
  const toRender = nestedAnnotations[0];
  const toNest = nestedAnnotations.slice(1);

  /**
   * Every annotation has a certain depth. In order to align underlines
   * between segments, gaps between nested annotations need to be filled.
   *
   * Consider three annotations, ABC, AB and BC:
   *          text: aabbcc
   * BC  (depth 3):   ____
   * AB  (depth 2): ____##
   * ABC (depth 1): ______
   * (underscores mark an underline, empty space is marked with ##)
   *
   * The annotation BC overlaps with AB.
   * This overlap results in an empty 'lane' between BC and the parent annotation ABC (##).
   * To correct for this empty space, a spacing component `DepthCorrection` is added.
   */
  const emptyAnnotationSpace = toNest[0]
    ? toNest[0].depth - toRender.depth - 1
    : 0;

  if (!nestedAnnotations.length) {
    return (
      <SearchHighlightAnnotation
        segment={props.segment}
        depthCorrection={props.depthCorrection}
      />
    );
  }
  return (
    <span
      className={createAnnotationClasses(
        props.segment,
        toRender,
        props.hoveringOn,
      )}
    >
      <DepthCorrection depthCorrection={emptyAnnotationSpace}>
        {toNest.length ? (
          <NestedAnnotation {...props} toNest={toNest} />
        ) : (
          <SearchHighlightAnnotation
            segment={props.segment}
            depthCorrection={props.depthCorrection}
          />
        )}
      </DepthCorrection>
    </span>
  );
}
