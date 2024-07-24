import {
  AnnotationSegment,
  isNestedAnnotationSegment,
  Segment,
} from "./AnnotationModel.ts";
import { createAnnotationClasses } from "./utils/createAnnotationClasses.ts";
import { SearchHighlightAnnotation } from "./SearchHighlightAnnotation.tsx";

export type NestedAnnotationProps = {
  segment: Segment;
  toNest: AnnotationSegment[];
  clickedSegment?: Segment;
};

export function NestedAnnotation(props: NestedAnnotationProps) {
  const nestedAnnotations = props.toNest.filter(isNestedAnnotationSegment);
  const toRender = nestedAnnotations[0];
  const toNest = nestedAnnotations.slice(1);

  if (!nestedAnnotations.length) {
    return <SearchHighlightAnnotation segment={props.segment} />;
  }
  return (
    <span className={createAnnotationClasses(props.segment, toRender)}>
      {toNest.length ? (
        <NestedAnnotation {...props} toNest={toNest} />
      ) : (
        <SearchHighlightAnnotation segment={props.segment} />
      )}
    </span>
  );
}
