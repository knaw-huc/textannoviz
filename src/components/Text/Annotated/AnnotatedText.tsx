import { BroccoliTextGeneric } from "../../../model/Broccoli.ts";
import { useAnnotationStore } from "../../../stores/annotation.ts";
import { createSearchRegex } from "../createSearchRegex.tsx";
import { SegmentedLine } from "./SegmentedLine.tsx";
import { createLineSearchOffsets } from "./utils/createLineSearchOffsets.ts";
import { getAnnotationsByTypes } from "./utils/getAnnotationsByTypes.ts";
import { useDetailUrlParams } from "./utils/useDetailUrlParams.tsx";
import "./annotated.css";
import { createLineOffsets } from "./utils/createLineOffsets.ts";
import { BroccoliViewPosition } from "../BroccoliViewPosition.ts";
import {
  projectConfigSelector,
  useProjectStore,
} from "../../../stores/project.ts";

type TextHighlightingProps = {
  text: BroccoliTextGeneric;
  showDetail: boolean;
};

/**
 * Annotation terms:
 * - Logical text: 'doorlopende' text, not split by line breaks
 * - Line: piece of annotated text as received from broccoli, a broccoli 'line' can also contain a logical text
 * - Character index: start index marks first character to include, stop index marks first character to exclude
 * - Offset: start or end character index of an annotation
 * - Segment: piece of line or annotation uninterrupted by annotation offsets
 * - Group: all annotations or segments that are connected to each other by other overlapping/nested annotations
 * - Depth: the number of levels that an annotation is nested in parent annotations or with overlapping annotations
 *   (when two annotations overlap, the second annotation has a depth of 2)
 */
export const AnnotatedText = (props: TextHighlightingProps) => {
  const { markerAnnotations } = useProjectStore(projectConfigSelector);
  const annotations = useAnnotationStore().annotations;

  const { tier2, highlight } = useDetailUrlParams();
  const searchTerms = highlight;

  const typesToHighlight = useAnnotationStore().annotationTypesToHighlight;
  const annotationsToHighlight = getAnnotationsByTypes(
    annotations,
    typesToHighlight,
    // TODO: clean up dummy data
  ).slice(0, 1);
  const lines = props.text.lines;

  // TODO: clean up dummy data
  // const positions = props.text.locations.annotations;
  const positions: BroccoliViewPosition[] = [
    {
      bodyId: annotationsToHighlight.find((a) => a.body.type === "tei:Ptr")!
        .body.id,
      start: { line: 0, offset: 10 },
      end: { line: 0, offset: -1 },
    },
  ];

  const offsets = annotationsToHighlight.map((annotation) =>
    createLineOffsets(annotation, positions, lines, markerAnnotations),
  );

  const searchRegex = createSearchRegex(searchTerms, tier2);
  const searchOffsets = createLineSearchOffsets(lines, searchRegex);
  offsets.push(...searchOffsets);

  console.log("AnnotatedText", {
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
