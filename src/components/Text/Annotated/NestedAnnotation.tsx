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
  clickedOn: AnnotationBodyId | undefined;
};

export function NestedAnnotation(props: NestedAnnotationProps) {
  const nestedAnnotations = props.toNest.filter(isNestedAnnotationSegment);
  const toRender = nestedAnnotations[0];
  const toNest = nestedAnnotations.slice(1);

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
    <span className={createAnnotationClasses(props.segment, toRender)}>
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
