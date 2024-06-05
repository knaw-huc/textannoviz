import { RelativeTextAnnotation } from "./RelativeTextAnnotation.ts";
import { listAnnotationOffsets } from "./utils/listAnnotationOffsets.ts";
import { createAnnotationSegments } from "./utils/createAnnotationSegments.ts";
import {
  AnnotationGroup,
  AnnotationSegment,
  LineSegment,
} from "./LineSegment.ts";
import { CSSProperties } from "react";

/**
 * Definitions:
 * - Line annotation segment: all annotations at a segment of a line.
 *   When one of the annotations in a segment closed, or when a new annotation starts, the current segment is closed and a new segment is started
 * - Annotation text
 * - Lane: underline height an annotation has, must stay the same across annotation segments
 */
export function LogicalLineHighlighting(props: {
  line: string;
  annotations: RelativeTextAnnotation[];
}) {
  const { line, annotations } = props;
  console.timeEnd("create-line");
  console.time("create-line");
  const annotationOffsets = listAnnotationOffsets(annotations);
  const annotationSegments = createAnnotationSegments(line, annotationOffsets);
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
        />
      ))}
    </>
  );
}

export type HighlightedSegmentProps = Omit<
  NestedAnnotationProps,
  "depthCorrection"
>;

export function HighlightedSegment(props: HighlightedSegmentProps) {
  const annotationGroup = props.segment.annotations[0]?.group;
  if (!annotationGroup) {
    return (
      <AnnotationSegmentBody body={props.segment.body} depthCorrection={0} />
    );
  } else {
    return (
      <HighlightedSegmentWithAnnotations {...props} group={annotationGroup} />
    );
  }
}

export function HighlightedSegmentWithAnnotations(
  props: HighlightedSegmentProps & { group: AnnotationGroup },
) {
  const groupMaxDepth = props.group.maxDepth;
  const segmentMaxDepth = props.segment.annotations.length;
  const depthCorrection = groupMaxDepth - segmentMaxDepth;

  return <NestedAnnotation {...props} depthCorrection={depthCorrection} />;
}

type NestedAnnotationProps = {
  segment: LineSegment;
  annotations: RelativeTextAnnotation[];
  depthCorrection: number;
};

export function NestedAnnotation(props: NestedAnnotationProps) {
  const segmentAnnotations = props.segment.annotations;
  if (!segmentAnnotations.length) {
    return (
      <AnnotationSegmentBody
        body={props.segment.body}
        depthCorrection={props.depthCorrection}
      />
    );
  }
  const toRender = segmentAnnotations[0];
  const toNest = segmentAnnotations.slice(1);
  const annotation = props.annotations.find(
    (a) => (a.anno.body.id = toRender.id),
  );
  if (!annotation) {
    throw new Error(`No annotation found for id ${toRender.id}`);
  }
  return (
    <span className={createAnnotationClasses(annotation, toRender)}>
      <NestedAnnotation
        {...props}
        segment={{ ...props.segment, annotations: toNest }}
      />
    </span>
  );
}

export function AnnotationSegmentBody(props: {
  body: string;
  depthCorrection: number;
}) {
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
  toRender: AnnotationSegment,
) {
  return [
    `nested-annotation`,
    `underlined-${annotation.anno.body.metadata.category}`,
    `id-${annotation.anno.body.id.replaceAll(":", "-")}`,
    `depth-${toRender.depth}`,
  ]
    .join(" ")
    .toLowerCase();
}
