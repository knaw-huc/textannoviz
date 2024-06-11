import { createSearchHighlightClasses } from "./utils/createAnnotationClasses.ts";
import { SegmentBody } from "./SegmentBody.tsx";
import { NestedAnnotationProps } from "./NestedAnnotation.tsx";

export function SearchHighlightAnnotation(
  props: Pick<NestedAnnotationProps, "segment" | "depthCorrection">,
) {
  const classNames: string[] = [];
  if (props.segment.searchHighlight) {
    classNames.push(
      createSearchHighlightClasses(
        props.segment.searchHighlight,
        props.segment,
      ),
    );
  }
  return (
    <span className={classNames.join(" ")}>
      <SegmentBody
        body={props.segment.body}
        depthCorrection={props.depthCorrection}
      />
    </span>
  );
}
