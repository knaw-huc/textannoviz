import { RelativeTextAnnotation } from "./RelativeTextAnnotation.ts";
import { listAnnotationOffsets } from "./utils/listAnnotationOffsets.ts";
import { createAnnotationSegments } from "./utils/createAnnotationSegments.ts";

/**
 * Definitions:
 * - Line annotation segment: all annotations at a segment of a line.
 *   When one of the annotations in a segment closed, or when a new annotation starts, the current segment is closed and a new segment is started
 * - Annotation text
 * - Lane: underline height an annotation has, must stay the same across annotation segments
 */
export function LogicalLine(props: {
  line: string;
  annotations: RelativeTextAnnotation[];
}) {
  const { line, annotations } = props;
  const annotatedLie = annotateLine(line, annotations);
  return <>{annotatedLie}</>;
}

// export function AnnotationSegment(props: {
//   onClick: () => void,
//   annotations: string[]
// }) {
//
// }

export function annotateLine(
  line: string,
  annotations: RelativeTextAnnotation[],
) {
  let toDisplay = "";
  console.time("create-line");
  const annotationOffsets = listAnnotationOffsets(annotations);
  const annotationSegments = createAnnotationSegments(line, annotationOffsets);
  console.log({ line, annotationSegments });
  // for (const [charIndex, annotation] of annotationPositions) {
  //   if(annotation.type === 'start') {
  //
  //   }
  // }

  for (let i = 0; i < line.length; i++) {
    toDisplay += line[i];
  }

  console.timeEnd("create-line");
  return toDisplay;
}
