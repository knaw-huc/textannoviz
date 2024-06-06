import { LineText } from "./LineText.tsx";
import { LineSegmentWithAnnotations } from "./LineSegmentWithAnnotations.tsx";
import { NestedAnnotationProps } from "./NestedAnnotation.tsx";
import { AnnotationBodyId } from "./Model.ts";

export type LineSegmentProps = Omit<
  NestedAnnotationProps,
  "depthCorrection"
> & {
  onHoverChange: (value: AnnotationBodyId | undefined) => void;
};

export function LineSegment(props: LineSegmentProps) {
  const annotationGroup = props.segment.annotations[0]?.group;
  if (!annotationGroup) {
    return <LineText body={props.segment.body} depthCorrection={0} />;
  }
  return (
    <LineSegmentWithAnnotations
      {...props}
      group={annotationGroup}
      onHoverChange={props.onHoverChange}
    />
  );
}
