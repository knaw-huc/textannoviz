import { bench, describe } from "vitest";
import type {
  BlockAnnotationSegment,
  Body,
  Segment,
} from "../AnnotationModel.ts";
import { BlockBuilder, type BlockSchema } from "./BlockBuilder.ts";

type TestBody = Body & { id: string };

describe("BlockBuilder", () => {
  const flatSchema: BlockSchema = {
    root: "root",
    blocks: {
      root: { blocks: ["section", "paragraph"] },
      section: { blocks: ["paragraph"] },
      paragraph: { blocks: [] },
    },
  };

  const nestedSchema: BlockSchema = {
    root: "root",
    blocks: {
      root: { blocks: ["section"] },
      section: { blocks: ["section", "paragraph"] },
      paragraph: { blocks: [] },
    },
  };

  const small = generateDocument(5, ["section", "paragraph"]);
  bench("section>p: 5 children per level (25 segments)", () => {
    new BlockBuilder<TestBody>(flatSchema).build(small);
  });

  const medium = generateDocument(50, ["section", "paragraph"]);
  bench("section>p: 50 children per level (2.5k segments)", () => {
    new BlockBuilder<TestBody>(flatSchema).build(medium);
  });

  const smallNested = generateDocument(5, ["section", "section", "paragraph"]);
  bench("section>section>p: 5 children per level (125 segments)", () => {
    new BlockBuilder<TestBody>(nestedSchema).build(smallNested);
  });

  const largeNested = generateDocument(50, ["section", "section", "paragraph"]);
  bench("section>section>p: 50 children per level (125k segments)", () => {
    new BlockBuilder<TestBody>(nestedSchema).build(largeNested);
  });
});

function generateDocument(childCount: number, nesting: string[]): Segment[] {
  const segments: Segment[] = [];
  let index = 0;

  function generate(
    level: number,
    ancestors: BlockAnnotationSegment<TestBody>[],
  ) {
    const blockType = nesting[level];
    const isLeaf = level === nesting.length - 1;

    for (let i = 0; i < childCount; i++) {
      const begin = index;

      if (isLeaf) {
        const ann: BlockAnnotationSegment<TestBody> = {
          blockType,
          body: { id: `${blockType}-${begin}` },
        } as BlockAnnotationSegment<TestBody>;

        const entity = { type: "entity", body: { id: `e-${begin}` } };

        segments.push({
          index,
          annotations: [...ancestors, ann, entity],
        } as Segment);
        index++;
      } else {
        const ann: BlockAnnotationSegment<TestBody> = {
          blockType,
          body: { id: `${blockType}-${begin}` },
        } as BlockAnnotationSegment<TestBody>;

        generate(level + 1, [...ancestors, ann]);
      }
    }
  }

  generate(0, []);
  return segments;
}
