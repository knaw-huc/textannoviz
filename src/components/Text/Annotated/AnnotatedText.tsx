import { BroccoliTextGeneric } from "../../../model/Broccoli.ts";
import { useAnnotationStore } from "../../../stores/annotation.ts";
import { getAnnotationsByTypes } from "./utils/getAnnotationsByTypes.ts";
import { SegmentedLine } from "./SegmentedLine.tsx";
import { createLineOffsets } from "./utils/createLineOffsets.ts";
import { createSearchRegex } from "../createSearchRegex.tsx";
import { createLineSearchOffsets } from "./utils/createLineSearchOffsets.ts";
import { useDetailUrlParams } from "./utils/useDetailUrlParams.tsx";
import _ from "lodash";
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
  const projectConfig = useProjectStore(projectConfigSelector);
  if (projectConfig.showAnnotations) {
    import("./annotated.css");
  }

  // TODO: why are there duplicates?
  const annotations = _.uniqBy(useAnnotationStore().annotations, "body.id");

  const { tier2, highlight } = useDetailUrlParams();
  const searchTerms = highlight;

  const typesToHighlight = useAnnotationStore().annotationTypesToHighlight;
  const positions = props.text.locations.annotations;

  const annotationsToHighlight = getAnnotationsByTypes(
    annotations,
    typesToHighlight,
  );
  const lines = props.text.lines;

  const offsets = annotationsToHighlight.map((a) =>
    createLineOffsets(a, positions, lines),
  );
  const searchRegex = createSearchRegex(searchTerms, tier2);
  const searchOffsets = createLineSearchOffsets(lines, searchRegex);
  offsets.push(...searchOffsets);

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
