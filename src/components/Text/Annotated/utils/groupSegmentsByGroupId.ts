import {
  GroupedSegments,
  isNestedAnnotationSegment,
  Segment,
} from "../AnnotationModel.ts";

export function groupSegmentsByGroupId(segments: Segment[]): GroupedSegments[] {
  const result: GroupedSegments[] = [];
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    const foundNestedAnnotation = segment.annotations.find(
      isNestedAnnotationSegment,
    );
    if (!foundNestedAnnotation) {
      result.push(createAnnotationlessGroup(segment));
      continue;
    }
    const groupId = foundNestedAnnotation.group.id;
    const foundGroup = result.find((g) => g.id === groupId);
    if (!foundGroup) {
      result.push({
        segments: [segments[i]],
        id: groupId,
      });
    } else {
      foundGroup.segments.push(segment);
    }
  }
  return result;
}

function createAnnotationlessGroup(segment: Segment): GroupedSegments {
  return { segments: [segment] };
}
