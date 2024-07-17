import { createSearchHighlightClasses } from "./utils/createAnnotationClasses.ts";
import { SegmentBody } from "./SegmentBody.tsx";
import { NestedAnnotationProps } from "./NestedAnnotation.tsx";
import { isSearchHighlightAnnotationSegment } from "./AnnotationModel.ts";

export function SearchHighlightAnnotation(
  props: Pick<NestedAnnotationProps, "segment">,
) {
  const classNames: string[] = [];
  const searchHighlight = props.segment.annotations.find(
    isSearchHighlightAnnotationSegment,
  );

  if (!searchHighlight) {
    return <SegmentBody body={props.segment.body} />;
  }

  classNames.push(createSearchHighlightClasses(searchHighlight, props.segment));
  return (
    <span className={classNames.join(" ")}>
      <SegmentBody body={props.segment.body} />
    </span>
  );
}
