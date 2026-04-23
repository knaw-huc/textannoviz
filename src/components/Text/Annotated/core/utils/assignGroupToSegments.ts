import {
  AnnotationGroup,
  GrouplessAnnotationSegment,
  GrouplessNestedSegment,
  GrouplessSegment,
  isGrouplessNestedSegment,
  isHighlightSegment,
  NestedSegment,
  Segment,
  SegmentOffsets,
} from "../AnnotationModel.ts";
import { orThrow } from "../../../../../utils/orThrow.tsx";

/**
 * Assign depth and group to nested annotations
 *
 * A group is a set of nested and highlight annotations connected through
 * overlap or nesting. Touching annotations (end of one === start of next)
 * start a new group. Blocks and markers do not affect groups.
 */
export function assignGroupToSegments(segments: GrouplessSegment[]): Segment[] {
  const groupedSegmentsMap = new Map<GrouplessNestedSegment, NestedSegment>();
  let currentDepth = 0;
  let currentGroup: AnnotationGroup = { id: 1, maxDepth: 0 };
  let activeGroupAnnotations: SegmentOffsets[] = [];

  for (const segment of segments) {
    // Close annotations ending at this segment:
    const closing = activeGroupAnnotations.filter(
      (n) => n.endSegment === segment.index,
    );
    if (closing.length) {
      activeGroupAnnotations = activeGroupAnnotations.filter(
        (offsets) => offsets.endSegment !== segment.index,
      );
      currentDepth = activeGroupAnnotations
        .filter((a) => (a as GrouplessAnnotationSegment).type === "nested")
        .reduce((max, n) => Math.max(max, (n as NestedSegment).depth), 0);

      // Start new group when all group annotations are closed:
      if (!activeGroupAnnotations.length) {
        currentGroup = { id: currentGroup.id + 1, maxDepth: 0 };
        currentDepth = 0;
      }
    }

    // Process new nested and highlight annotations:
    for (const annotation of segment.annotations) {
      if (isGrouplessNestedSegment(annotation)) {
        if (groupedSegmentsMap.has(annotation)) {
          continue;
        }
        const grouped: NestedSegment = {
          ...annotation,
          depth: ++currentDepth,
          group: currentGroup,
        };
        groupedSegmentsMap.set(annotation, grouped);
        activeGroupAnnotations.push(grouped);
        currentGroup.maxDepth = Math.max(currentGroup.maxDepth, currentDepth);
      } else if (isHighlightSegment(annotation)) {
        if (!activeGroupAnnotations.includes(annotation)) {
          activeGroupAnnotations.push(annotation);
        }
      }
    }
  }

  return segments.map((segment) => {
    const annotations = segment.annotations.map((annotation) => {
      if (!isGrouplessNestedSegment(annotation)) {
        return annotation;
      }
      return groupedSegmentsMap.get(annotation) ?? orThrow("Not found");
    });
    return {
      ...segment,
      annotations,
    };
  });
}
