import {
  Segment,
  GroupedSegments,
  isNestedSegment,
} from "../AnnotationModel.ts";
import { Offsets } from "@knaw-huc/text-annotation-segmenter";

export function groupSegmentsByGroupId(
  segments: Segment[],
  offsets: Offsets,
): GroupedSegments[] {
  const result: GroupedSegments[] = [];
  for (const segment of segments) {
    const foundNestedAnnotation = segment.annotations.find(isNestedSegment);
    if (!foundNestedAnnotation) {
      result.push({ segments: [segment], offsets });
      continue;
    }
    const groupId = foundNestedAnnotation.group.id;
    const foundGroup = result.find((g) => g.id === groupId);
    if (!foundGroup) {
      result.push({ segments: [segment], id: groupId, offsets });
    } else {
      foundGroup.segments.push(segment);
    }
  }
  return result;
}
