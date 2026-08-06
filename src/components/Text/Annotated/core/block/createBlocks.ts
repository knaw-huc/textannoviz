import {
  Group,
  groupSegments,
  SegmentGroup,
} from "@knaw-huc/text-annotation-segmenter";
import {
  AnnotationSegment,
  BlockAnnotationSegment,
  isBlockAnnotationSegment,
  Segment,
} from "../AnnotationModel.ts";
import { Block, Element, Inline } from "./BlockModel.ts";

export function createBlocks(segments: Segment[]): Element[] {
  return groupSegments(
    segments,
    isBlockAnnotationSegment,
    (a) => a.body.id,
  ).map(toElement);
}

function toElement(node: SegmentGroup<AnnotationSegment>): Element {
  if (!node.isGroup) {
    return createInline(node.segments);
  }
  return createBlock(node);
}

function createBlock(node: Group<AnnotationSegment>): Block {
  const annotation = node.annotation as BlockAnnotationSegment;
  const firstSegment = findFirstSegment(node);
  return {
    isBlock: true,
    id: annotation.body.id,
    blockType: annotation.blockType,
    isContinuation:
      !!firstSegment && firstSegment.index > annotation.startSegment,
    annotation,
    children: node.children.map(toElement),
  };
}

function createInline(segments: Segment[]): Inline {
  return { isBlock: false, segments };
}

function findFirstSegment(
  group: SegmentGroup<AnnotationSegment>,
): Segment | undefined {
  if (!group.isGroup) {
    return group.segments[0];
  }
  for (const child of group.children) {
    const found = findFirstSegment(child);
    if (found) {
      return found;
    }
  }
}
