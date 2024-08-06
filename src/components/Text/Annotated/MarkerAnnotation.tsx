import { createMarkerClasses } from "./utils/createAnnotationClasses.ts";
import { SegmentBody } from "./SegmentBody.tsx";
import { NestedAnnotationProps } from "./NestedAnnotation.tsx";
import { isMarkerSegment } from "./AnnotationModel.ts";
import { FootnoteModalButton } from "./FootnoteModal.tsx";

export function MarkerAnnotation(
  props: Pick<NestedAnnotationProps, "segment">,
) {
  const classNames: string[] = [];
  const marker = props.segment.annotations.find(isMarkerSegment);

  if (!marker) {
    return <SegmentBody body={props.segment.body} />;
  }

  classNames.push(createMarkerClasses(marker));
  return (
    <span className={classNames.join(" ")}>
      <FootnoteModalButton clickedMarker={marker}>*</FootnoteModalButton>
    </span>
  );
}
