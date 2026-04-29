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
  annotation: BlockAnnotationSegment<T>;
  children: Element[];
};
