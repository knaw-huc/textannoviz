import {
  BlockAnnotationSegment,
  isBlockAnnotationSegment,
  Segment,
} from "../AnnotationModel.ts";
import { Block, Element, Inline } from "./BlockModel.ts";

type GroupedSegments = {
  block?: BlockAnnotationSegment;
  segments: Segment[];
};

export function createBlocks(segments: Segment[]): Element[] {
  return createElements(segments, 0);
}

function createElements(segments: Segment[], depth: number): Element[] {
  const groups = groupSegmentsByBlock(segments, depth);
  return groups.map((group) =>
    group.block
      ? createBlock(group.block, group.segments, depth)
      : createInline(group.segments),
  );
}

function groupSegmentsByBlock(
  segments: Segment[],
  depth: number,
): GroupedSegments[] {
  const groups: GroupedSegments[] = [];
  let currentId: string | undefined;
  let currentGroup: GroupedSegments | undefined;

  for (const segment of segments) {
    const block = getBlock(segment, depth);
    const id = block?.body.id;

    if (!currentGroup || id !== currentId) {
      currentGroup = block
        ? { block, segments: [segment] }
        : { segments: [segment] };
      groups.push(currentGroup);
      currentId = id;
    } else {
      currentGroup.segments.push(segment);
    }
  }
  return groups;
}

function getBlock(
  segment: Segment,
  depth: number,
): BlockAnnotationSegment | undefined {
  let blockIndex = 0;
  for (const annotation of segment.annotations) {
    if (isBlockAnnotationSegment(annotation)) {
      if (blockIndex === depth) {
        return annotation;
      }
      blockIndex++;
    }
  }
  return;
}

function createBlock(
  annotation: BlockAnnotationSegment,
  segments: Segment[],
  depth: number,
): Block {
  return {
    isBlock: true,
    id: annotation.body.id,
    blockType: annotation.blockType,
    annotation,
    children: createElements(segments, depth + 1),
  };
}

function createInline(segments: Segment[]): Inline {
  return { isBlock: false, segments };
}
