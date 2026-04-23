import {
  mapAnnotationSegmentRanges,
  segment,
  SegmentRange,
} from "@knaw-huc/text-annotation-segmenter";
import {
  GrouplessAnnotationSegment,
  Segment,
  TextOffsets,
} from "../AnnotationModel.ts";
import { assignGroupToSegments } from "./assignGroupToSegments.ts";

/**
 * Split a text into {@link Segment}s using annotation character offsets.
 *
 * Each segment contains the text and a sorted list of annotation segments:
 * markers first, then remaining annotations sorted largest-first (so smallest nest deepest).
 */
export function createSegments(
  body: string,
  offsets: TextOffsets[],
): Segment[] {
  const textSegments = segment(body, offsets);
  const annotationRanges = mapAnnotationSegmentRanges(textSegments);
  const segmentsByOffsets = mapSegmentsByOffsets(annotationRanges);
  const sortedSegments = textSegments.map((textSegment) => {
    const sorted = sortAnnotations(textSegment.annotations, segmentsByOffsets);
    return { ...textSegment, annotations: sorted };
  });
  const groupedSegments = assignGroupToSegments(sortedSegments);
  return groupedSegments;
}

/**
 * Map annotation segments, keyed by object reference
 */
function mapSegmentsByOffsets(
  segmentRanges: Map<TextOffsets, SegmentRange>,
): Map<TextOffsets, GrouplessAnnotationSegment> {
  const result = new Map<TextOffsets, GrouplessAnnotationSegment>();
  for (const [offset, range] of segmentRanges) {
    result.set(offset, toAnnotationSegment(offset, range));
  }
  return result;
}

function toAnnotationSegment(
  offset: TextOffsets,
  range: SegmentRange,
): GrouplessAnnotationSegment {
  const base = { ...range, ...offset };
  if (offset.type === "block") {
    return { ...base, blockType: offset.blockType! };
  } else if (offset.type === "marker") {
    return { ...base, type: "marker", endSegment: base.startSegment };
  } else {
    return { ...base, type: offset.type };
  }
}

/**
 * Sort annotations:
 * - markers first
 * - longest first
 */
function sortAnnotations(
  annotations: TextOffsets[],
  segmentByOffsets: Map<TextOffsets, GrouplessAnnotationSegment>,
): GrouplessAnnotationSegment[] {
  const markers = annotations
    .filter((a) => a.type === "marker")
    .map((a) => segmentByOffsets.get(a)!);
  const withLength = annotations
    .filter((a) => a.type !== "marker")
    .sort(bySegmentLength)
    .map((a) => segmentByOffsets.get(a)!);
  return [...markers, ...withLength];
}

/**
 * Nest smallest annotations deepest
 */
function bySegmentLength(a: TextOffsets, b: TextOffsets) {
  return b.end - b.begin - (a.end - a.begin);
}
