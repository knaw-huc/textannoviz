import {
  AnnotationBodyId,
  AnnotationSegment,
  isNestedAnnotationSegment,
  Segment,
} from "./AnnotationModel.ts";
import { createAnnotationClasses } from "./utils/createAnnotationClasses.ts";
import { SearchHighlightAnnotation } from "./SearchHighlightAnnotation.tsx";
import { CSSProperties } from "react";

export type NestedAnnotationProps = {
  segment: Segment;
  toNest: AnnotationSegment[];
  depthCorrection: number;
  hoveringOn: AnnotationBodyId | undefined;
};

/**
 * Every annotation has a certain depth
 * An overlapping annotation BC with a higher depth can continue after an annotation AB with a lower depth has finished
 * This overlap results in an empty 'lane' between the overlapping annotation BC and the annotation below the finished annotation ABC
 * Something like this: (the empty space is marked with ##)
 *         text: aabbcc
 * BC  (depth 3):   ____
 * AB  (depth 2): ____##
 * ABC (depth 1): ______
 *
 * To correct for this empty space some padding is added by annotation A
 */
const EMPTY_DEPTH_CORRECTION = 3;

export function NestedAnnotation(props: NestedAnnotationProps) {
  const nestedAnnotations = props.toNest.filter(isNestedAnnotationSegment);
  const toRender = nestedAnnotations[0];
  const toNest = nestedAnnotations.slice(1);

  const style: CSSProperties = {};
  if (toNest[0]) {
    const difference = toNest[0].depth - toRender.depth;
    style.paddingBottom = (difference - 1) * EMPTY_DEPTH_CORRECTION;
  }

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
      style={style}
    >
      {toNest.length ? (
        <NestedAnnotation {...props} toNest={toNest} />
      ) : (
        <SearchHighlightAnnotation
          segment={props.segment}
          depthCorrection={props.depthCorrection}
        />
      )}
    </span>
  );
}
