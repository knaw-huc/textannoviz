import {
  BlockAnnotationSegment,
  BlockType,
  Segment,
  Body,
} from "../AnnotationModel.ts";

export type Element = Block | Inline;

export type Inline = {
  isBlock: false;
  segments: Segment[];
};

export type Block<T extends Body = Body> = {
  isBlock: true;
  id: string;
  blockType: BlockType;
  /**
   * True when this block continues an annotation that was split by an
   * overlapping parent block (e.g. a paragraph interrupted by a page break).
   */
  isContinuation: boolean;
  annotation: BlockAnnotationSegment<T>;
  children: Element[];
};
