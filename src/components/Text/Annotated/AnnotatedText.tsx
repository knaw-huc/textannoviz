import { BroccoliTextGeneric } from "../../../model/Broccoli.ts";
import { useAnnotationStore } from "../../../stores/annotation.ts";
import { createSearchRegex } from "../createSearchRegex.tsx";
import { SegmentedLine } from "./SegmentedLine.tsx";
import { createLineSearchOffsets } from "./utils/createLineSearchOffsets.ts";
import { getAnnotationsByTypes } from "./utils/getAnnotationsByTypes.ts";
import { useDetailUrlParams } from "./utils/useDetailUrlParams.tsx";
import "./annotated.css";
import { createLineOffsets } from "./utils/createLineOffsets.ts";
import {
  projectConfigSelector,
  useProjectStore,
} from "../../../stores/project.ts";

type TextHighlightingProps = {
  text: BroccoliTextGeneric;
  showDetail: boolean;
};

export const DUMMY_ID = "urn:suriano:file:1697716";

/**
 * Annotation definitions
 * - Depth: the number of levels that an annotation is nested in parent annotations or overlapping annotations
 *   (when two annotations overlap, the second annotation has a depth of 2)
 * - Group: all annotations or segments that are connected to each other by other overlapping/nested annotations
 * - Line: piece of annotated text as received from broccoli, a broccoli 'line' can also contain a logical text
 * - Marker: annotation of zero length marking the location of a footnote annotation
 * - Offset: start or end character index of an annotation in a line
 *   - start index marks first character to include
 *   - stop index marks first character to exclude
 * - Segment: piece of line or annotation uninterrupted by annotation offsets
 */
export const AnnotatedText = (props: TextHighlightingProps) => {
  const { markerAnnotations } = useProjectStore(projectConfigSelector);
  const annotations = useAnnotationStore().annotations;

  const { tier2, highlight } = useDetailUrlParams();
  const searchTerms = highlight;
  const isDummy = DUMMY_ID === tier2;
  const typesToHighlight = useAnnotationStore().annotationTypesToHighlight;
  const annotationsToHighlight = getAnnotationsByTypes(
    annotations,
    typesToHighlight,
    // TODO: clean up dummy data
  ).slice(0, isDummy ? 1 : undefined);
  const lines = props.text.lines;

  // TODO: clean up dummy data
  const positions = isDummy
    ? [
        {
          bodyId: annotationsToHighlight.find((a) => a.body.type === "tei:Ptr")!
            .body.id,
          start: { line: 0, offset: 10 },
          end: { line: 0, offset: -1 },
        },
      ]
    : props.text.locations.annotations;

  const offsets = annotationsToHighlight.map((annotation) =>
    createLineOffsets(annotation, positions, lines, markerAnnotations),
  );

  const searchRegex = createSearchRegex(searchTerms, tier2);
  const searchOffsets = createLineSearchOffsets(lines, searchRegex);
  offsets.push(...searchOffsets);

  console.log("AnnotatedText", {
    markerAnnotations,
    annotationsToHighlight,
    offsets,
  });

  return (
    <div>
      {props.text.lines.map((line, index) => (
        <SegmentedLine
          key={index}
          line={line}
          offsets={offsets.filter((a) => a.lineIndex === index)}
        />
      ))}
    </div>
  );
};
