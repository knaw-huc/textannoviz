import { BlockType } from "../AnnotationModel.ts";

export type BlockSchema = {
  root: BlockType;
  blocks: Record<BlockType, BlockConfig>;
};

type BlockConfig = {
  blocks: BlockType[];
};
