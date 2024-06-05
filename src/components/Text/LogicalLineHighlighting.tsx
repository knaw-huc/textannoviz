import {
  AnnotationBodyId,
  RelativeTextAnnotation,
} from "./RelativeTextAnnotation.ts";
import { listAnnotationOffsets } from "./utils/listAnnotationOffsets.ts";
import { createAnnotationSegments } from "./utils/createAnnotationSegments.ts";
import { AnnotationGroup, LineSegment } from "./LineSegment.ts";
import { CSSProperties } from "react";
import _ from "lodash";

/**
 * Definitions:
 * - Logical text: 'doorlopende' text, not split by line breaks
 * - Line: piece of annotated text as received from broccoli, a 'line' could also contain a logical text
 * - Annotation offset: character index at which an annotation starts or stops
 * - Character index: start index marks first character to include, stop index marks first character to exclude
 * - Line segment: piece of line uninterrupted by annotation offsets
 * - Annotation segment: piece of an annotation uninterrupted by the offsets of other overlapping/nested annotations
 * - Annotation group: all annotations that are connected to each other by other overlapping/nested annotations
 * - Annotation depth: the number of levels that an annotation is nested in parent annotations or with overlapping annotations
 *   (when two annotations overlap, the second annotation has a depth of 2)
 */
export function LogicalLineHighlighting(props: {
  line: string;
  annotations: RelativeTextAnnotation[];
  hoveringOn: AnnotationBodyId | undefined;
  onHoverChange: (value: AnnotationBodyId | undefined) => void;
}) {
  const { line, annotations } = props;
  console.timeEnd("create-line");
  console.time("create-line");
  const annotationOffsets = listAnnotationOffsets(annotations);
  const annotationSegments = createAnnotationSegments(
    line,
    annotationOffsets,
    annotations,
  );
  if (line.startsWith("Synde ter vergaderinge")) {
    console.timeLog("create-line", { line, annotationSegments });
  }
  return (
    <>
      {annotationSegments.map((segment, i) => (
        <HighlightedSegment
          key={i}
          segment={segment}
          annotations={annotations}
          hoveringOn={props.hoveringOn}
          onHoverChange={props.onHoverChange}
        />
      ))}
    </>
  );
}

export type HighlightedSegmentProps = Omit<
  NestedAnnotationProps,
  "depthCorrection"
> & {
  onHoverChange: (value: AnnotationBodyId | undefined) => void;
};

export function HighlightedSegment(props: HighlightedSegmentProps) {
  const annotationGroup = props.segment.annotations[0]?.group;
  if (!annotationGroup) {
    return <SegmentBody body={props.segment.body} depthCorrection={0} />;
  }
  return (
    <HighlightedSegmentWithAnnotations
      {...props}
      group={annotationGroup}
      onHoverChange={props.onHoverChange}
    />
  );
}

type HighlightedSegmentWithAnnotationsProps = HighlightedSegmentProps & {
  group: AnnotationGroup;
};

export function HighlightedSegmentWithAnnotations(
  props: HighlightedSegmentWithAnnotationsProps,
) {
  const groupMaxDepth = props.group.maxDepth;
  const segmentMaxDepth =
    _.maxBy(props.segment.annotations, "depth")?.depth ?? 0;
  const depthCorrection = groupMaxDepth - segmentMaxDepth;

  const selectOnHover = props.segment.annotations.at(-1);
  if (!selectOnHover) {
    throw new Error("No annotation to select on hover");
  }
  return (
    <span
      className="annotated-segment"
      onMouseOver={() => props.onHoverChange(selectOnHover.id)}
      onMouseLeave={() => props.onHoverChange(undefined)}
    >
      <NestedAnnotation {...props} depthCorrection={depthCorrection} />
    </span>
  );
}

type NestedAnnotationProps = {
  segment: LineSegment;
  annotations: RelativeTextAnnotation[];
  depthCorrection: number;
  hoveringOn: AnnotationBodyId | undefined;
};

export function NestedAnnotation(props: NestedAnnotationProps) {
  const segmentAnnotations = props.segment.annotations;
  const toRender = segmentAnnotations[0];
  const toNest = segmentAnnotations.slice(1);
  const annotation = props.annotations.find(
    (a) => a.anno.body.id === toRender.id,
  );
  if (!annotation) {
    throw new Error(
      `No annotation found for segment annotation id ${toRender.id}`,
    );
  }
  return (
    <span className={createAnnotationClasses(annotation, props.hoveringOn)}>
      {toNest.length ? (
        <NestedAnnotation
          {...props}
          segment={{ ...props.segment, annotations: toNest }}
        />
      ) : (
        <SegmentBody
          body={props.segment.body}
          depthCorrection={props.depthCorrection}
        />
      )}
    </span>
  );
}

export function SegmentBody(props: { body: string; depthCorrection: number }) {
  let className: string | undefined;
  const style: CSSProperties = {};
  if (props.depthCorrection) {
    className = `depth-correction`;
    style.marginBottom = props.depthCorrection * 3;
  }
  return (
    <span className={className} style={style}>
      {props.body}
    </span>
  );
}

function createAnnotationClasses(
  annotation: RelativeTextAnnotation,
  hoveringOn: AnnotationBodyId | undefined,
) {
  const classes = [
    `nested-annotation`,
    `underlined-${annotation.anno.body.metadata.category}`,
    `id-${annotation.anno.body.id.replaceAll(":", "-")}`,
  ];
  if (hoveringOn === annotation.anno.body.id) {
    classes.push("hover-underline");
  }
  return classes.join(" ").toLowerCase();
}
