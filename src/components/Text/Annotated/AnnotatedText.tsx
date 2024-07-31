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
 * Definitions:
 * - Logical text: 'doorlopende' text, not split by line breaks
 * - Line: piece of annotated text as received from broccoli, a broccoli 'line' can also contain a logical text
 * - Annotation offset: character index at which an annotation starts or stops
 * - Character index: start index marks first character to include, stop index marks first character to exclude
 * - Line segment: piece of line uninterrupted by annotation offsets
 * - Annotation segment: piece of an annotation uninterrupted by the offsets of other overlapping/nested annotations
 * - Annotation group: all annotations that are connected to each other by other overlapping/nested annotations
 * - Annotation depth: the number of levels that an annotation is nested in parent annotations or with overlapping annotations
 *   (when two annotations overlap, the second annotation has a depth of 2)
 */
export const AnnotatedText = (props: TextHighlightingProps) => {
  const { footnoteMarkerAnnotations } = useProjectStore(projectConfigSelector);
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

  const offsets = annotationsToHighlight.map((a) =>
    createLineOffsets(
      a,
      positions,
      lines,
      footnoteMarkerAnnotations.includes(a.body.type),
    ),
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
