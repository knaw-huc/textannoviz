import { BroccoliTextGeneric } from "../../model/Broccoli";
import { useAnnotationStore } from "../../stores/annotation.ts";
import { getAnnotationsByType } from "./getAnnotationsByType.tsx";
import { AnnoRepoAnnotation } from "../../model/AnnoRepoAnnotation.ts";

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
  const relativeAnnotationPositions = props.text.locations.annotations;
  const logicalAnnotations = annotationsToHighlight.map((a) =>
    withRelativePosition(a, relativeAnnotationPositions),
  );

  console.log("LogicalTextHighlighting", {
    annotationsToHighlight,
    relativeAnnotationPositions,
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
  if (
    !positionRelativeToView.start.offset ||
    !positionRelativeToView.end.offset
  ) {
    throw new Error(`Start or end offset missing: ${positionRelativeToView}`);
  }
  return {
    type: annotation.body.type,
    anno: annotation,
    startChar: positionRelativeToView.start.offset,
    endChar: positionRelativeToView.end.offset,
  };
}
