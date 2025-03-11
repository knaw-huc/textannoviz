import { BroccoliTextGeneric } from "../../../model/Broccoli.ts";
import { useAnnotationStore } from "../../../stores/annotation.ts";
// import { createSearchRegex } from "../createSearchRegex.tsx";
import { SegmentedLine } from "./SegmentedLine.tsx";
import { createSearchHighlightOffsets } from "./utils/createSearchHighlightOffsets.ts";
// import { useDetailUrlParams } from "./utils/useDetailUrlParams.tsx";
import "./annotated.css";
import {
  projectConfigSelector,
  useProjectStore,
} from "../../../stores/project.ts";
import {
  AnnoRepoAnnotation,
  isLogicalTextAnchorTarget,
} from "../../../model/AnnoRepoAnnotation.ts";
import {
  createAnnotationLineOffsets,
  createMarkerLineOffsets,
} from "./utils/createLineOffsets.ts";
import { LineOffsets } from "./AnnotationModel.ts";
import { createSearchRegex } from "../createSearchRegex.tsx";
import { useDetailNavigation } from "../../Detail/useDetailNavigation.tsx";
import { useTextStore } from "../../../stores/text.ts";
import { useEffect } from "react";

type TextHighlightingProps = {
  text: BroccoliTextGeneric;
  showDetail: boolean;
};

/**
 * Annotation definitions
 * - Highlights: annotations that only have styling
 * - Nested annotations: nestable and clickable. A group of nested entities can be clicked and inspected in the EntityModal
 * - Marker: annotation of zero length, useful for marking locations of footnotes, page endings, etc.
 * - Group: all annotations or segments that are connected to each other by nested annotations
 *   - touching annotations are not grouped (e.g. <a>aa</a><b>bb</bb>)
 *   - overlapping annotations are grouped (e.g. <ab>aa<bc>bb</bc>cc</bc>)
 *   - grouped annotations share a group with ID
 * - Depth: the number of levels that an annotation is nested in parent annotations or overlapping annotations
 *   (when two annotations overlap, the second annotation has a depth of 2)
 * - Line: piece of annotated text as received from broccoli, a broccoli 'line' can also contain a logical text
 * - Offset: start or end character index of an annotation in a line
 *   - start index marks first character to include
 *   - stop index marks first character to exclude
 * - Segment: piece of line or annotation uninterrupted by annotation offsets
 */
export const AnnotatedText = (props: TextHighlightingProps) => {
  const {
    tooltipMarkerAnnotationTypes,
    pageMarkerAnnotationTypes,
    insertTextMarkerAnnotationTypes,
    entityAnnotationTypes,
    highlightedAnnotationTypes,
  } = useProjectStore(projectConfigSelector);
  const annotations = useAnnotationStore().annotations;
  const { setHighlightedSearchId, isInitSearchHighlight } = useTextStore();
  const { tier2, highlight } = useDetailNavigation().getDetailParams();
  const searchTerms = highlight;
  const lines = props.text.lines;

  const relativeAnnotations = props.text.locations.annotations;
  // No offsets when no relative annotations
  const offsets: LineOffsets[] = [];

  const singleLineAnnotations = annotations.filter(withTargetInSingleLine);

  const nestedAnnotationTypes = [...entityAnnotationTypes];
  if (relativeAnnotations.length) {
    const nestedAnnotations = singleLineAnnotations
      .filter((a) => nestedAnnotationTypes.includes(a.body.type))
      .map((annotation) =>
        createAnnotationLineOffsets(
          annotation,
          relativeAnnotations,
          lines,
          "annotation",
        ),
      );
    offsets.push(...nestedAnnotations);
    const highlightedAnnotations = singleLineAnnotations
      .filter((a) => highlightedAnnotationTypes.includes(a.body.type))
      .map((annotation) =>
        createAnnotationLineOffsets(
          annotation,
          relativeAnnotations,
          lines,
          "highlight",
        ),
      );
    offsets.push(...highlightedAnnotations);
  }

  const searchHighlight = createSearchRegex(searchTerms, tier2);
  const searchHighlightOffsets = createSearchHighlightOffsets(
    lines,
    searchHighlight,
  );
  offsets.push(...searchHighlightOffsets);

  const markerAnnotations = [
    ...tooltipMarkerAnnotationTypes,
    ...insertTextMarkerAnnotationTypes,
    ...pageMarkerAnnotationTypes,
  ];
  offsets.push(
    ...annotations
      .filter((a) => markerAnnotations.includes(a.body.type))
      .map((annotation) =>
        createMarkerLineOffsets(annotation, relativeAnnotations),
      ),
  );

  /**
   * TODO: use search highlights to scroll
   * - Config option to enable highlight scrolling
   * - Store that tracks which highlight is highlighted
   * - Panel that shows prev/next button
   * - Highlight first search highlight
   * - Move to prev/next highlight
   */
  useEffect(() => {
    if (!isInitSearchHighlight && searchHighlightOffsets.length) {
      setHighlightedSearchId(searchHighlightOffsets[0].body.id);
    }
  }, [isInitSearchHighlight]);

  console.log("AnnotatedText", { offsets, searchHighlightOffsets });

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
