import { BlockSchema } from "./BlockSchema.ts";
import { Block, Element } from "./BlockModel.ts";

/**
 * Remove elements that violate block schema:
 * - unwrap children of invalid blocks into grandparent
 * - remove whitespace-only inlines inside blockOnly parents
 */
export function removeInvalidElements(
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
      if (config?.blockOnly && isWhitespaceOnly(child)) {
        // console.debug(`Remove whitespace from ${block.blockType} ${block.id}`);
        return [];
      }
      return [child];
    }
    if (allowed.includes(child.blockType)) {
      return [filterBlock(child, schema)];
    }
    // console.debug(`Unwrap ${child.blockType} ${child.id} into ${block.blockType}`);
    return child.children;
  });

  return { ...block, children };
}

function isWhitespaceOnly(inline: Element): boolean {
  if (inline.isBlock) {
    return false;
  }
  return inline.segments.every((s) => /^\s*$/.test(s.body));
}
