import {
  isHighlightSegment,
  isMarkerSegment,
  Segment,
} from "../AnnotationModel.ts";
import { SegmentBody } from "./SegmentBody.tsx";
import { useAnnotatedTextConfig } from "../useAnnotatedTextConfig.tsx";

export function HighlightAnnotations(props: { segment: Segment }) {
  const { Highlight, Marker } = useAnnotatedTextConfig();
  const highlights = props.segment.annotations.filter(isHighlightSegment);
  const marker = props.segment.annotations.find(isMarkerSegment);

  const text = <SegmentBody body={props.segment.body} />;

  const children = marker ? (
    <Marker marker={marker} segment={props.segment} />
  ) : (
    text
  );

  if (!highlights.length) {
    return children;
  }

  return (
    <Highlight highlights={highlights} segment={props.segment}>
      {children}
    </Highlight>
  );
}
