import {
  BlockAnnotationSegment,
  Body,
  isBlockAnnotationSegment,
  Segment,
} from "../AnnotationModel.ts";
import { Block, Element, Inline } from "./BlockModel.ts";

type GroupedSegments<T extends Body> = {
  block?: BlockAnnotationSegment<T>;
  segments: Segment[];
};

export function createBlocks<T extends Body = Body>(
  segments: Segment[],
): Element[] {
  return createElements<T>(segments, 0);
}

function createElements<T extends Body = Body>(
  segments: Segment[],
  depth: number,
): Element[] {
  const groups = groupSegmentsByBlock<T>(segments, depth);
  return groups.map((group) =>
    group.block
      ? createBlock(group.block, group.segments, depth)
      : createInline(group.segments),
  );
}

function groupSegmentsByBlock<T extends Body = Body>(
  segments: Segment[],
  depth: number,
): GroupedSegments<T>[] {
  const groups: GroupedSegments<T>[] = [];
  let currentId: string | undefined;
  let currentGroup: GroupedSegments<T> | undefined;

  for (const segment of segments) {
    const block = getBlock<T>(segment, depth);
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

function getBlock<T extends Body = Body>(
  segment: Segment,
  depth: number,
): BlockAnnotationSegment<T> | undefined {
  let blockIndex = 0;
  for (const annotation of segment.annotations) {
    if (isBlockAnnotationSegment<T>(annotation)) {
      if (blockIndex === depth) {
        return annotation;
      }
      blockIndex++;
    }
  }
  return;
}

function createBlock<T extends Body = Body>(
  annotation: BlockAnnotationSegment<T>,
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
