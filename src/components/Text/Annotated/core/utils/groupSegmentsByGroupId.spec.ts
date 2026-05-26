import { describe, expect, it } from "vitest";
import { groupSegmentsByGroupId } from "./groupSegmentsByGroupId.ts";
import { AnnotationGroup, NestedSegment, Segment } from "../AnnotationModel.ts";
import { uniqueId } from "lodash";

describe(groupSegmentsByGroupId.name, () => {
  it("groups segments by their ID", () => {
    const offsets = { start: 0, end: 2 };
    const group: AnnotationGroup = { id: 1, maxDepth: 1 };
    const nested = createNestedAnnotation(group);

    const segments: Segment[] = [
      { index: 0, start: 0, end: 1, value: "a", annotations: [nested] },
      { index: 1, start: 1, end: 2, value: "b", annotations: [nested] },
    ];

    const result = groupSegmentsByGroupId(segments, offsets);

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
    expect(result[0].segments).toHaveLength(2);
    expect(result[0].segments[0].value).toBe("a");
    expect(result[0].segments[1].value).toBe("b");
  });

  it("preserves segment order when same group is separated by ungrouped segment", () => {
    const offsets = { start: 0, end: 3 };
    const group: AnnotationGroup = { id: 1, maxDepth: 1 };
    const nestedA = createNestedAnnotation(group, 0, 1);
    const nestedB = createNestedAnnotation(group, 2, 3);

    const segments: Segment[] = [
      { index: 0, start: 0, end: 1, value: "a", annotations: [nestedA] },
      { index: 1, start: 1, end: 2, value: "+", annotations: [] },
      { index: 2, start: 2, end: 3, value: "b", annotations: [nestedB] },
    ];

    const result = groupSegmentsByGroupId(segments, offsets);

    expect(result).toHaveLength(3);
    expect(result[0].id).toBe(1);
    expect(result[0].segments[0].value).toBe("a");
    expect(result[1].id).toBeUndefined();
    expect(result[1].segments[0].value).toBe("+");
    expect(result[2].id).toBe(1);
    expect(result[2].segments[0].value).toBe("b");
  });
});

function createNestedAnnotation(
  group: AnnotationGroup,
  startSegment = 0,
  endSegment = 2,
): NestedSegment {
  return {
    type: "nested",
    body: { id: uniqueId() },
    startSegment,
    endSegment,
    depth: 1,
    group,
  };
}
