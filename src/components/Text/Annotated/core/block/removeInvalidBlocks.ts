import { BlockSchema } from "./BlockSchema.ts";
import { Block, Element } from "./BlockModel.ts";

/**
 * Remove blocks that violate block schema,
 * unwrapping the children of invalid blocks into their grandparent.
 */
export function removeInvalidBlocks(
  elements: Element[],
  schema: BlockSchema,
): Element[] {
  return elements.flatMap((element): Element[] => {
    if (!element.isBlock) {
      return [element];
    }
    return [filterBlock(element, schema)];
  });
}

function filterBlock(block: Block, schema: BlockSchema): Block {
  const config = schema.blocks[block.blockType];
  const allowed = config?.children ?? [];

  const children = block.children.flatMap((child) => {
    if (!child.isBlock) {
      return [child];
    }
    if (allowed.includes(child.blockType)) {
      return [filterBlock(child, schema)];
    }
    return child.children;
  });

  return { ...block, children };
}
