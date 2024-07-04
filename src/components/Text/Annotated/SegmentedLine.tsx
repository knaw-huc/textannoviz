import { listOffsetsByChar } from "./utils/listOffsetsByChar.ts";
import { AnnotationSegmenter } from "./utils/AnnotationSegmenter.ts";
import { AnnotationBodyId, LineOffsets, Segment } from "./AnnotationModel.ts";
import { LineSegmentsViewer } from "./LineSegmentsViewer.tsx";
import { TextModal } from "../TextModal.tsx";

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
export function SegmentedLine(props: {
  line: string;
  offsets: LineOffsets[];
  clickedAnnotation: AnnotationBodyId | undefined;
  onSegmentClicked: (value: Segment | undefined) => void;
}) {
  const { line, offsets } = props;
  if (line.startsWith("Synde ter vergaderinge")) {
    console.time("create-line");
  }
  const offsetsByChar = listOffsetsByChar(offsets);
  const segments = new AnnotationSegmenter(line, offsetsByChar).segment();
  if (line.startsWith("Synde ter vergaderinge")) {
    console.timeLog("create-line", { line, annotationSegments: segments });
    console.timeEnd("create-line");
  }
  return (
    <>
      <TextModal segments={segments} />
      <LineSegmentsViewer
        segments={segments}
        showDetails={false}
        clickedAnnotation={props.clickedAnnotation}
        onSegmentClicked={props.onSegmentClicked}
      />
    </>
  );
}
