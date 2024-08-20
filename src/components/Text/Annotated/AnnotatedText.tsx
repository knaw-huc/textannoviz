import { BroccoliTextGeneric } from "../../../model/Broccoli.ts";
import { useAnnotationStore } from "../../../stores/annotation.ts";
import { createSearchRegex } from "../createSearchRegex.tsx";
import { SegmentedLine } from "./SegmentedLine.tsx";
import { createSearchOffsets } from "./utils/createSearchOffsets.ts";
import { useDetailUrlParams } from "./utils/useDetailUrlParams.tsx";
import "./annotated.css";
import {
  projectConfigSelector,
  useProjectStore,
} from "../../../stores/project.ts";
import _ from "lodash";
import {
  AnnoRepoAnnotation,
  isLogicalTextAnchorTarget,
} from "../../../model/AnnoRepoAnnotation.ts";
import {
  createFootnoteMarkLineOffsets,
  createNestedLineOffsets,
  createPageMarkLineOffsets,
} from "./utils/createLineOffsets.ts";
import { LineOffsets } from "./AnnotationModel.ts";

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
 * - Marker: annotation of zero length, useful for marking locations of footnotes, page endings, etc.
 * - Offset: start or end character index of an annotation in a line
 *   - start index marks first character to include
 *   - stop index marks first character to exclude
 * - Segment: piece of line or annotation uninterrupted by annotation offsets
 */
export const AnnotatedText = (props: TextHighlightingProps) => {
  const { footnoteMarkerAnnotationTypes, pageMarkerAnnotationTypes } =
    useProjectStore(projectConfigSelector);
  const annotations = useAnnotationStore().annotations;

  const { tier2, highlight } = useDetailUrlParams();
  const searchTerms = highlight;
  // const isDummy = DUMMY_ID === tier2;
  const isDummy = false;
  const annotationTypesToHighlight =
    useAnnotationStore().annotationTypesToHighlight;
  const lines = props.text.lines;

  // TODO: clean up dummy data
  const relativeAnnotations = isDummy
    ? [
        {
          bodyId: annotations.find((a) => a.body.type === "tei:Ptr")!.body.id,
          start: { line: 0, offset: 10 },
          end: { line: 0, offset: -1 },
        },
      ]
    : props.text.locations.annotations;
  // No offsets when no relative annotations
  const offsets: LineOffsets[] = [];

  const singleLineAnnotations = annotations.filter(withTargetInSingleLine);

  if (relativeAnnotations.length) {
    const nestedAnnotations = singleLineAnnotations
      .filter((a) => annotationTypesToHighlight.includes(a.body.type))
      .map((annotation) =>
        createNestedLineOffsets(annotation, relativeAnnotations, lines),
      );
    console.log("nestedAnnotations", nestedAnnotations);
    offsets.push(...nestedAnnotations);
  }

  const searchRegex = createSearchRegex(searchTerms, tier2);
  offsets.push(...createSearchOffsets(lines, searchRegex));
  offsets.push(
    ...singleLineAnnotations
      .filter((a) => footnoteMarkerAnnotationTypes.includes(a.body.type))
      .map((annotation) =>
        createFootnoteMarkLineOffsets(annotation, relativeAnnotations),
      ),
  );
  offsets.push(
    ...annotations
      .filter((a) => pageMarkerAnnotationTypes.includes(a.body.type))
      .map((annotation) =>
        createPageMarkLineOffsets(annotation, relativeAnnotations),
      ),
  );

  console.log("AnnotatedText", {
    footnoteMarkerAnnotationTypes,
    annotations,
    relativeAnnotations,
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

function withTargetInSingleLine(a: AnnoRepoAnnotation) {
  if (!Array.isArray(a.target)) {
    return false;
  }
  const textAnchorSelector = a.target.find(isLogicalTextAnchorTarget);
  if (!textAnchorSelector) {
    return false;
  }
  if (textAnchorSelector.selector.start !== textAnchorSelector.selector.end) {
    console.debug(
      `Ignoring annotation that spans multiple lines: ${a.body.id}`,
    );
    return false;
  }
  return true;
}

Object.assign(window, { _ });
