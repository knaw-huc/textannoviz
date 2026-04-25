import { describe, expect, it } from "vitest";
import { validateBlockOrder } from "./validateBlockOrder.ts";
import type { Segment } from "../AnnotationModel.ts";

describe(validateBlockOrder.name, () => {
  it("rejects invalid nesting", () => {
    const schema = {
      root: "root",
      blocks: {
        root: { blocks: ["section", "paragraph"] },
        section: { blocks: ["paragraph"] },
        paragraph: { blocks: [] },
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
