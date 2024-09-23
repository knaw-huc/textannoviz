import { createHighlightClasses } from "./utils/createAnnotationClasses.ts";
import { NestedAnnotationProps } from "./NestedAnnotation.tsx";
import { isHighlightSegment } from "./AnnotationModel.ts";
import { MarkerAnnotation } from "./MarkerAnnotation.tsx";

export function HighlightAnnotation(
  props: Pick<NestedAnnotationProps, "segment">,
) {
  const classNames: string[] = [];
  const highlight = props.segment.annotations.find(isHighlightSegment);

  if (!highlight) {
    return <MarkerAnnotation segment={props.segment} />;
  }

  classNames.push(createHighlightClasses(highlight, props.segment));
  return (
    <span className={classNames.join(" ")}>
      <MarkerAnnotation segment={props.segment} />
    </span>
  );
}
