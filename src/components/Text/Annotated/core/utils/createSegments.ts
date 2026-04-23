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
 * Split a text into {@link GrouplessSegment}s using annotation character offsets.
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
  const annotationSegments = mapSegmentsByOffsets(annotationRanges);
  const segments = textSegments.map((textSegment, index) => {
    return {
      ...textSegment,
      index,
      annotations: sortByLength(textSegment.annotations, annotationSegments),
    };
  });
  return assignGroupToSegments(segments);
}

/**
 * Map annotation segments, keyed by object identity.
 */
function mapSegmentsByOffsets(
  ranges: Map<TextOffsets, SegmentRange>,
): Map<TextOffsets, GrouplessAnnotationSegment> {
  const result = new Map<TextOffsets, GrouplessAnnotationSegment>();
  for (const [offset, range] of ranges) {
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

function sortByLength(
  annotations: TextOffsets[],
  segmentMap: Map<TextOffsets, GrouplessAnnotationSegment>,
): GrouplessAnnotationSegment[] {
  const resolve = (a: TextOffsets) => segmentMap.get(a)!;
  const markers = annotations.filter((a) => a.type === "marker").map(resolve);
  const rest = annotations
    .filter((a) => a.type !== "marker")
    .sort(bySegmentLength)
    .map(resolve);
  return [...markers, ...rest];
}

/**
 * Nest smallest annotations deepest
 */
function bySegmentLength(a: TextOffsets, b: TextOffsets) {
  return b.end - b.begin - (a.end - a.begin);
}
