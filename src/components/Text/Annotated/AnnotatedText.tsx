import { BroccoliTextGeneric } from "../../../model/Broccoli.ts";
import { useAnnotationStore } from "../../../stores/annotation.ts";
import { SegmentedText } from "./SegmentedText.tsx";
import { createSearchHighlightOffsets } from "./utils/createSearchHighlightOffsets.ts";
import "./annotated.css";
import {
  projectConfigSelector,
  useProjectStore,
} from "../../../stores/project.ts";
import {
  createAnnotationTextOffsets,
  createMarkerTextOffsets,
} from "./utils/createTextOffsets.ts";
import { TextOffsets } from "./AnnotationModel.ts";
import { createSearchRegex } from "../createSearchRegex.tsx";
import { useDetailNavigation } from "../../Detail/useDetailNavigation.tsx";

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
 * - Text: piece of annotated text as received from broccoli, as found in the body of {@link BroccoliTextGeneric}
 * - Offset: start or end character index of an annotation in a text
 *   - begin index marks first character to include
 *   - end index marks first character to exclude (note: see {@link TextOffsets})
 * - Segment: piece of text or annotation uninterrupted by annotation offsets
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

  const { tier2, highlight } = useDetailNavigation().getDetailParams();
  const searchTerms = highlight;
  const textBody = props.text.body;
  const relativeAnnotations = props.text.locations.annotations;
  // No offsets when no relative annotations
  const offsets: TextOffsets[] = [];

  const nestedAnnotationTypes = [...entityAnnotationTypes];
  if (relativeAnnotations.length) {
    const nestedAnnotations = annotations
      .filter((a) => nestedAnnotationTypes.includes(a.body.type))
      .map((annotation) =>
        createAnnotationTextOffsets(
          annotation,
          relativeAnnotations,
          "annotation",
        ),
      );
    offsets.push(...nestedAnnotations);
    const highlightedAnnotations = annotations
      .filter((a) => highlightedAnnotationTypes.includes(a.body.type))
      .map((annotation) =>
        createAnnotationTextOffsets(
          annotation,
          relativeAnnotations,
          "highlight",
        ),
      );
    offsets.push(...highlightedAnnotations);
  }

  const searchHighlight = createSearchRegex(searchTerms, tier2);
  offsets.push(...createSearchHighlightOffsets(textBody, searchHighlight));

  const markerAnnotations = [
    ...tooltipMarkerAnnotationTypes,
    ...insertTextMarkerAnnotationTypes,
    ...pageMarkerAnnotationTypes,
  ];
  offsets.push(
    ...annotations
      .filter((a) => markerAnnotations.includes(a.body.type))
      .map((annotation) =>
        createMarkerTextOffsets(annotation, relativeAnnotations),
      ),
  );
  return (
    <div className="whitespace-pre-wrap">
      <SegmentedText body={textBody} offsets={offsets} />
    </div>
  );
};
