import { describe, test } from "vitest";
import type {
  BlockAnnotationSegment,
  Body,
  Segment,
} from "../AnnotationModel.ts";
import { createBlocks } from "./createBlocks.ts";

type TestBody = Body & { id: string };

describe(createBlocks.name, () => {
  const small = generateDocument(5, ["section", "paragraph"]);
  test("section>p: 5 children per level (25 segments)", async ({ bench }) => {
    await bench("section>p: 5 children per level (25 segments)", () => {
      createBlocks(small);
    }).run();
  });

  const medium = generateDocument(50, ["section", "paragraph"]);
  test("section>p: 50 children per level (2.5k segments)", async ({
    bench,
  }) => {
    await bench("section>p: 50 children per level (2.5k segments)", () => {
      createBlocks(medium);
    }).run();
  });

  const smallNested = generateDocument(5, ["section", "section", "paragraph"]);
  test("section>section>p: 5 children per level (125 segments)", async ({
    bench,
  }) => {
    await bench(
      "section>section>p: 5 children per level (125 segments)",
      () => {
        createBlocks(smallNested);
      },
    ).run();
  });

  const largeNested = generateDocument(50, ["section", "section", "paragraph"]);
  test("section>section>p: 50 children per level (125k segments)", async ({
    bench,
  }) => {
    await bench(
      "section>section>p: 50 children per level (125k segments)",
      () => {
        createBlocks(largeNested);
      },
    ).run();
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
