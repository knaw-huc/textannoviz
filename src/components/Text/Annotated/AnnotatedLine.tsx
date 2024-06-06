import {
  AnnotationBodyId,
  RelativeTextAnnotation,
} from "../RelativeTextAnnotation.ts";
import { listAnnotationOffsets } from "./utils/listAnnotationOffsets.ts";
import { createAnnotationSegments } from "./utils/createAnnotationSegments.ts";
import { LineSegment } from "./LineSegment.tsx";

/**
 * Definitions:
 * - Logical text: 'doorlopende' text, not split by line breaks
 * - Line: piece of annotated text as received from broccoli, a 'line' could also contain a logical text
 * - Annotation offset: character index at which an annotation starts or stops
 * - Character index: start index marks first character to include, stop index marks first character to exclude
 * - Line segment: piece of line uninterrupted by annotation offsets
 * - Annotation segment: piece of an annotation uninterrupted by the offsets of other overlapping/nested annotations
 * - Annotation group: all annotations that are connected to each other by other overlapping/nested annotations
 * - Annotation depth: the number of levels that an annotation is nested in parent annotations or with overlapping annotations
 *   (when two annotations overlap, the second annotation has a depth of 2)
 */
export function AnnotatedLine(props: {
  line: string;
  annotations: RelativeTextAnnotation[];
  hoveringOn: AnnotationBodyId | undefined;
  onHoverChange: (value: AnnotationBodyId | undefined) => void;
}) {
  const { line, annotations } = props;
  console.timeEnd("create-line");
  console.time("create-line");
  const annotationOffsets = listAnnotationOffsets(annotations);
  const annotationSegments = createAnnotationSegments(
    line,
    annotationOffsets,
    annotations,
  );
  if (line.startsWith("Synde ter vergaderinge")) {
    console.timeLog("create-line", { line, annotationSegments });
  }
  return (
    <>
      {annotationSegments.map((segment, i) => (
        <LineSegment
          key={i}
          segment={segment}
          annotations={annotations}
          hoveringOn={props.hoveringOn}
          onHoverChange={props.onHoverChange}
        />
      ))}
    </>
  );
}
