import {
  BlockAnnotationSegment,
  BlockType,
  Segment,
} from "../AnnotationModel.ts";

export type Element = Block | Inline;

export type Inline = {
  isBlock: false;
  segments: Segment[];
};

export type Block = {
  isBlock: true;
  id: string;
  blockType: BlockType;
  annotation: BlockAnnotationSegment;
  children: Element[];
};
