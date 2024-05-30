import { BroccoliTextGeneric } from "../../model/Broccoli";
import { useAnnotationStore } from "../../stores/annotation.ts";
import { getAnnotationsByType } from "./utils/getAnnotationsByType.ts";
import { AnnoRepoAnnotation } from "../../model/AnnoRepoAnnotation.ts";
import { RelativeTextAnnotation } from "./RelativeTextAnnotation.ts";
import { LogicalLine } from "./LogicalLine.tsx";
import { withRelativePosition } from "./utils/withRelativePosition.ts";
import { BroccoliViewPosition } from "./BroccoliViewPosition.ts";

type TextHighlightingProps = {
  text: BroccoliTextGeneric;
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

  let logicalAnnotations: RelativeTextAnnotation[];
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
          <LogicalLine
            line={line}
            annotations={logicalAnnotations.filter(
              (a) => a.lineIndex === index,
            )}
          />
        </div>
      ))}
    </div>
  );
};

function isAnnotationInSingleLine(
  annotation: AnnoRepoAnnotation,
  relativePositions: BroccoliViewPosition[],
) {
  const relative = relativePositions.find(
    (p) => p.bodyId === annotation.body.id,
  );
  const isInSingleLine = relative && relative.start.line === relative.end.line;
  if (!isInSingleLine) {
    console.debug(`Ignoring multiline annotation ${annotation.id}`);
  }
  return isInSingleLine;
}
