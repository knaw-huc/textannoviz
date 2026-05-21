import {
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
  return createBlock(node.annotation as BlockAnnotationSegment, node.children);
}

function createBlock(
  annotation: BlockAnnotationSegment,
  children: SegmentGroup<AnnotationSegment>[],
): Block {
  return {
    isBlock: true,
    id: annotation.body.id,
    blockType: annotation.blockType,
    annotation,
    children: children.map(toElement),
  };
}

function createInline(segments: Segment[]): Inline {
  return { isBlock: false, segments };
}
