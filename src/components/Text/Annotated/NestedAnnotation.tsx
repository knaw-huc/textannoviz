import {
  AnnotationBodyId,
  AnnotationSegment,
  isNestedAnnotationSegment,
  Segment,
} from "./AnnotationModel.ts";
import { createAnnotationClasses } from "./utils/createAnnotationClasses.ts";
import { SearchHighlightAnnotation } from "./SearchHighlightAnnotation.tsx";

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
