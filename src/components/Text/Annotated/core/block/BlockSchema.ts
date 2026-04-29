import { BlockType } from "../AnnotationModel.ts";

export type BlockSchema = {
  root: BlockType;
  blocks: Record<BlockType, BlockConfig>;
};

type BlockConfig = {
  children: BlockType[];
  blockOnly?: boolean;
};
