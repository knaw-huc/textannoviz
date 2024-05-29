import { BroccoliTextGeneric } from "../../model/Broccoli";
import { useAnnotationStore } from "../../stores/annotation.ts";
import { getAnnotationsByType } from "./getAnnotationsByType.tsx";
import { AnnoRepoAnnotation } from "../../model/AnnoRepoAnnotation.ts";
import * as _ from "lodash";

type TextHighlightingProps = {
  text: BroccoliTextGeneric;
};

type AnnotationType = string;

/**
 * Annotation with positions relative to item
 */
type RelativeTextAnnotation = {
  type: AnnotationType;
  startChar: number;
  endChar: number;
  anno: AnnoRepoAnnotation;
};

type BroccoliViewPosition = {
  bodyId: string;
  start: { line: number; offset?: number };
  end: { line: number; offset?: number };
};

export const LogicalTextHighlighting = (props: TextHighlightingProps) => {
  const annotations = useAnnotationStore().annotations;
  const typesToHighlight = useAnnotationStore().annotationTypesToHighlight;
  const annotationsToHighlight = getAnnotationsByType(
    annotations,
    typesToHighlight,
  );
  const relativePositions = props.text.locations.annotations;
  const lines = props.text.lines;

  let logicalAnnotations;
  try {
    logicalAnnotations = annotationsToHighlight
      .filter((a) => isAnnotationInSingleLine(a, relativePositions))
      .map((a) => withRelativePosition(a, relativePositions, lines));
  } catch (e) {
    console.error("Could not create logical annotations", e);
    return null;
  }

  console.log("LogicalTextHighlighting", {
    typesToHighlight,
    annotationsToHighlight,
    relativeAnnotationPositions: relativePositions,
    logicalAnnotations,
  });

  return (
    <div className="leading-loose">
      {props.text.lines.map((line, index) => (
        <div key={index} className="w-fit">
          {line}
        </div>
      ))}
    </div>
  );
};

function withRelativePosition(
  annotation: AnnoRepoAnnotation,
  positionsRelativeToView: BroccoliViewPosition[],
  lines: string[],
): RelativeTextAnnotation {
  const positionRelativeToView = positionsRelativeToView.find(
    (p) => p.bodyId === annotation.body.id,
  );
  if (!positionRelativeToView) {
    throw new Error(`Position not found of ${annotation}`);
  }
  if (positionRelativeToView.start.line !== positionRelativeToView.end.line) {
    throw new Error(`Annotation spans multiple lines: ${annotation.body.id}`);
  }
  const startChar: number = _.has(positionRelativeToView.start, "offset")
    ? positionRelativeToView.start.offset!
    : 0;
  const endChar: number = _.has(positionRelativeToView.end, "offset")
    ? positionRelativeToView.end.offset!
    : lines[positionRelativeToView.end.line].length;
  return {
    type: annotation.body.type,
    anno: annotation,
    startChar,
    endChar,
  };
}

function isAnnotationInSingleLine(
  annotation: AnnoRepoAnnotation,
  relativePositions: BroccoliViewPosition[],
) {
  const relative = relativePositions.find(
    (p) => p.bodyId === annotation.body.id,
  );
  const isInSingleLine = relative && relative.start.line === relative.end.line;
  if (!isInSingleLine) {
    console.debug(`Ignoring annotation ${annotation.id}: not in single line`);
  }
  return isInSingleLine;
}
