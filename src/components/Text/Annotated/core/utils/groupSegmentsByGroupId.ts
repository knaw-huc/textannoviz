import {
  Segment,
  GroupedSegments,
  isNestedSegment,
} from "../AnnotationModel.ts";

export function groupSegmentsByGroupId(segments: Segment[]): GroupedSegments[] {
  const result: GroupedSegments[] = [];
  for (const segment of segments) {
    const foundNestedAnnotation = segment.annotations.find(isNestedSegment);
    if (!foundNestedAnnotation) {
      result.push({ segments: [segment] });
      continue;
    }
    const groupId = foundNestedAnnotation.group.id;
    const foundGroup = result.find((g) => g.id === groupId);
    if (!foundGroup) {
      result.push({ segments: [segment], id: groupId });
    } else {
      foundGroup.segments.push(segment);
    }
  }
  return result;
}
