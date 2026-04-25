import { describe, expect, it } from "vitest";
import { validateBlockOrder } from "./validateBlockOrder.ts";
import type { Segment } from "../AnnotationModel.ts";
import { BlockSchema } from "./BlockSchema.ts";

describe(validateBlockOrder.name, () => {
  it("accepts valid nesting", () => {
    const schema: BlockSchema = {
      root: "root",
      blocks: {
        root: { children: ["paragraph"] },
        paragraph: { children: [] },
      },
    };

    const p: Segment[] = [
      {
        index: 0,
        begin: 0,
        end: 2,
        body: "aa",
        annotations: [
          {
            type: "block",
            blockType: "paragraph",
            body: { id: "p" },
            startSegment: 0,
            endSegment: 1,
          },
        ],
      },
    ];

    expect(() => validateBlockOrder(p, schema)).not.toThrow();
  });

  it("rejects invalid nesting", () => {
    const schema: BlockSchema = {
      root: "root",
      blocks: {
        root: { children: ["section", "paragraph"] },
        section: { children: ["paragraph"] },
        paragraph: { children: [] },
      },
    };

    const sectionInP: Segment[] = [
      {
        index: 0,
        begin: 0,
        end: 2,
        body: "aa",
        annotations: [
          {
            type: "block",
            blockType: "paragraph",
            body: { id: "p" },
            startSegment: 0,
            endSegment: 1,
          },
          {
            type: "block",
            blockType: "section",
            body: { id: "s" },
            startSegment: 0,
            endSegment: 1,
          },
        ],
      },
    ];

    expect(() => validateBlockOrder(sectionInP, schema)).toThrow(
      "Block type paragraph does not allow section",
    );
  });
});
