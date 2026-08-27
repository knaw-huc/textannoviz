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
  // Allow for multiple matches. E.g., for Mechteld, there are sometimes two footnote markers next to each other.
  // Those markers have the same start and end, so there will be two annotations of type 'marker'.
  // The .filter() will find all, instead of only the first with the previous .find().
  const markers = props.segment.annotations.filter(isMarkerSegment);

  const text = <SegmentBody body={props.segment.value} />;

  const children = markers.length
    ? markers.map((marker) => (
        <Marker key={marker.body.id} marker={marker} segment={props.segment} />
      ))
    : text;

  if (!highlights.length) {
    return children;
  }

  return (
    <Highlight highlights={highlights} segment={props.segment}>
      {children}
    </Highlight>
  );
}
