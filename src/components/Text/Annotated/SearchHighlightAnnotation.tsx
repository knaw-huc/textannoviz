import { createSearchHighlightClasses } from "./utils/createAnnotationClasses.ts";
import { NestedAnnotationProps } from "./NestedAnnotation.tsx";
import { isSearchHighlightSegment } from "./AnnotationModel.ts";
import { MarkerAnnotation } from "./MarkerAnnotation.tsx";

export function SearchHighlightAnnotation(
  props: Pick<NestedAnnotationProps, "segment">,
) {
  const classNames: string[] = [];
  const searchHighlight = props.segment.annotations.find(
    isSearchHighlightSegment,
  );

  if (!searchHighlight) {
    return <MarkerAnnotation segment={props.segment} />;
  }

  classNames.push(createSearchHighlightClasses(searchHighlight, props.segment));
  return (
    <span className={classNames.join(" ")}>
      <MarkerAnnotation segment={props.segment} />
    </span>
  );
}
