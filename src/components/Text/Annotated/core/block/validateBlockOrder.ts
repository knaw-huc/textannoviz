import { isBlockAnnotationSegment, Segment } from "../AnnotationModel.ts";
import { BlockSchema } from "./BlockSchema.ts";

export function validateBlockOrder(
  segments: Segment[],
  schema: BlockSchema,
): void {
  for (const segment of segments) {
    let parent = schema.root;

    for (const annotation of segment.annotations) {
      if (!isBlockAnnotationSegment(annotation)) {
        continue;
      }

      const allowed = schema.blocks[parent]?.blocks ?? [];
      const type = annotation.blockType;
      if (!allowed.includes(type)) {
        throw new Error(`Block type ${parent} does not allow ${type}`);
      }
      parent = type;
    }
  }
}
