import { BroccoliTextGeneric } from "../../../model/Broccoli.ts";
import { useAnnotationStore } from "../../../stores/annotation.ts";
import { getAnnotationsByTypes } from "./utils/getAnnotationsByTypes.ts";
import { SegmentedLine } from "./SegmentedLine.tsx";
import { createLineOffsets } from "./utils/createLineOffsets.ts";
import { isAnnotationInSingleLine } from "./utils/isAnnotationInSingleLine.ts";
import { createSearchRegex } from "../createSearchRegex.tsx";
import { createLineSearchOffsets } from "./utils/createLineSearchOffsets.ts";
import { DUMMY_ANNOTATION_RESOLUTION } from "../../../utils/broccoli.ts";
import { useDetailUrlParams } from "./utils/useDetailUrlParams.tsx";
import _ from "lodash";

type TextHighlightingProps = {
  text: BroccoliTextGeneric;
  showDetail: boolean;
};

export const AnnotatedText = (props: TextHighlightingProps) => {
  // TODO: why are there duplicates?
  const annotations = _.uniqBy(useAnnotationStore().annotations, "body.id");
  const { tier2, highlight } = useDetailUrlParams();
  // TODO: clean up dummy search terms
  const useDummy = tier2 === DUMMY_ANNOTATION_RESOLUTION;
  console.log("AnnotatedText", { useDummy });
  const dummySearchTerms = "Huijgens Bronchoven rdam";
  const searchTerms = useDummy ? dummySearchTerms : highlight;

  const typesToHighlight = useAnnotationStore().annotationTypesToHighlight;
  const positions = props.text.locations.annotations;

  const annotationsToHighlight = getAnnotationsByTypes(
    annotations,
    typesToHighlight,
  ).filter((a) => isAnnotationInSingleLine(a, positions));
  const lines = props.text.lines;

  const offsets = annotationsToHighlight.map((a) =>
    createLineOffsets(a, positions, lines),
  );
  const searchRegex = createSearchRegex(searchTerms, tier2);
  const searchOffsets = createLineSearchOffsets(lines, searchRegex);
  offsets.push(...searchOffsets);
  console.debug("LogicalTextHighlighting", {
    typesToHighlight,
    annotationsToHighlight,
    positions,
    searchTerms,
    searchRegex,
    searchOffsets,
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
