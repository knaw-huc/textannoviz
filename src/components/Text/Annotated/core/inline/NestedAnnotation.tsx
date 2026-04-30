import {
  AnnotationSegment,
  isNestedSegment,
  Segment,
} from "../AnnotationModel.ts";
import { HighlightAnnotations } from "./HighlightAnnotations.tsx";

import { useAnnotatedTextConfig } from "../useAnnotatedTextConfig.tsx";

export type NestedAnnotationProps = {
  segment: Segment;
  toNest: AnnotationSegment[];
  clickedSegment?: Segment;
};

export function NestedAnnotation(props: NestedAnnotationProps) {
  const { Nested } = useAnnotatedTextConfig();

  const nestedAnnotations = props.toNest.filter(isNestedSegment);
  const toRender = nestedAnnotations[0];
  const toNest = nestedAnnotations.slice(1);

  if (!nestedAnnotations.length) {
    return <HighlightAnnotations segment={props.segment} />;
  }

  return (
    <Nested nested={toRender} segment={props.segment}>
      {toNest.length ? (
        <NestedAnnotation {...props} toNest={toNest} />
      ) : (
        <HighlightAnnotations segment={props.segment} />
      )}
    </Nested>
  );
}
