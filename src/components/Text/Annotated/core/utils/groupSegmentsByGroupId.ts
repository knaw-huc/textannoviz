import {
  Segment,
  GroupedSegments,
  isNestedSegment,
} from "../AnnotationModel.ts";
import { TextPosition } from "@knaw-huc/text-annotation-segmenter";

export function groupSegmentsByGroupId(
  segments: Segment[],
  offsets: TextPosition,
): GroupedSegments[] {
  const result: GroupedSegments[] = [];
  for (const segment of segments) {
    const foundNestedAnnotation = segment.annotations.find(isNestedSegment);
    if (!foundNestedAnnotation) {
      result.push({ segments: [segment], offsets });
      continue;
    }
    const groupId = foundNestedAnnotation.group.id;
    const lastGroup = result.at(-1);

    // Add to group when previous ID matches, otherwise create new group:
    if (lastGroup?.id === groupId) {
      lastGroup.segments.push(segment);
    } else {
      result.push({ segments: [segment], id: groupId, offsets });
    }
  }
  return result;
}
