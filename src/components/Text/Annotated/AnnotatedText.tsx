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
  findRelativePosition,
  WithRelativePosition,
} from "./utils/createTextOffsets.ts";
import { TextOffsets } from "./AnnotationModel.ts";
import { createSearchRegex } from "../createSearchRegex.tsx";
import { useDetailNavigation } from "../../Detail/useDetailNavigation.tsx";
import uniq from "lodash/uniq";
import { isMarker } from "./MarkerAnnotation.tsx";

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
  const projectConfig = useProjectStore(projectConfigSelector);
  const { entityAnnotationTypes, highlightedAnnotationTypes } = projectConfig;
  const typesToInclude = uniq([
    ...entityAnnotationTypes,
    ...highlightedAnnotationTypes,
  ]);
  const annotations = useAnnotationStore().annotations.filter((a) => {
    if (typesToInclude.includes(a.body.type)) return true;
    if (isMarker(a, projectConfig)) return true;
  });
  const withRelative: WithRelativePosition[] = annotations
    .map((annotation) => {
      const relativePositions = props.text.locations.annotations;
      const relative = findRelativePosition(annotation, relativePositions);
      return { annotation, relative };
    })
    .filter((toTest): toTest is WithRelativePosition => !!toTest.relative);

  const { tier2, highlight } = useDetailNavigation().getDetailParams();
  const searchTerms = highlight;
  const textBody = props.text.body;
  // No offsets when no relative annotations
  const offsets: TextOffsets[] = [];

  const nestedAnnotationTypes = [...entityAnnotationTypes];
  const nestedAnnotations = withRelative
    .filter((a) => nestedAnnotationTypes.includes(a.annotation.body.type))
    .map(({ annotation, relative }) =>
      createAnnotationTextOffsets(annotation, relative, "annotation"),
    );
  offsets.push(...nestedAnnotations);
  const highlightedAnnotations = withRelative
    .filter(({ annotation }) =>
      highlightedAnnotationTypes.includes(annotation.body.type),
    )
    .map(({ annotation, relative }) =>
      createAnnotationTextOffsets(annotation, relative, "highlight"),
    );
  offsets.push(...highlightedAnnotations);

  const searchHighlight = createSearchRegex(searchTerms, tier2);
  offsets.push(...createSearchHighlightOffsets(textBody, searchHighlight));

  const markerAnnotations = withRelative
    .filter(({ annotation }) => isMarker(annotation, projectConfig))
    .map(({ annotation, relative }) =>
      createMarkerTextOffsets(annotation, relative),
    );
  offsets.push(...markerAnnotations);
  return (
    <div className="whitespace-pre-wrap">
      <SegmentedText body={textBody} offsets={offsets} />
    </div>
  );
};
