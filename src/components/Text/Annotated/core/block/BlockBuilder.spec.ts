import { describe, expect, it } from "vitest";
import { BlockBuilder, BlockSchema } from "./BlockBuilder.ts";
import {
  AnnotationSegment,
  BlockSegment,
  Segment,
} from "../AnnotationModel.ts";

describe(BlockBuilder.name, () => {
  it("builds example", () => {
    const blockSchema: BlockSchema = {
      root: "root",
      blocks: {
        root: { blocks: ["section", "paragraph"] },
        section: { blocks: ["paragraph"] },
        paragraph: { blocks: [] },
      },
    };

    const segA = seg(0, [ent("e-AB")]);
    const segB = seg(1, [
      ent("e-AB"),
      ent("e-BC"),
      blk("p-B", "paragraph"),
      blk("s-BC", "section"),
    ]);
    const segC = seg(2, [
      ent("e-BC"),
      blk("p-C", "paragraph"),
      blk("s-BC", "section"),
    ]);
    const segD = seg(3, []);
    const segE = seg(4, [blk("s-E", "section")]);

    const result = new BlockBuilder(blockSchema).build([
      segA,
      segB,
      segC,
      segD,
      segE,
    ]);

    expect(result).toEqual([
      { isBlock: false, segments: [segA] },
      {
        id: "s-BC",
        isBlock: true,
        blockType: "section",
        children: [
          {
            id: "p-B",
            isBlock: true,
            blockType: "paragraph",
            children: [{ isBlock: false, segments: [segB] }],
          },
          {
            id: "p-C",
            isBlock: true,
            blockType: "paragraph",
            children: [{ isBlock: false, segments: [segC] }],
          },
        ],
      },
      { isBlock: false, segments: [segD] },
      {
        id: "s-E",
        isBlock: true,
        blockType: "section",
        children: [{ isBlock: false, segments: [segE] }],
      },
    ]);
  });

  it("builds section > section > p", () => {
    const schema: BlockSchema = {
      root: "root",
      blocks: {
        root: { blocks: ["section"] },
        section: { blocks: ["section", "paragraph"] },
        paragraph: { blocks: [] },
      },
    };

    const seg1 = seg(0, [
      blk("s-outer", "section"),
      blk("s-inner", "section"),
      blk("p-1", "paragraph"),
    ]);
    const seg2 = seg(1, [
      blk("s-outer", "section"),
      blk("s-inner", "section"),
      blk("p-2", "paragraph"),
    ]);

    const result = new BlockBuilder(schema).build([seg1, seg2]);

    expect(result).toEqual([
      {
        id: "s-outer",
        isBlock: true,
        blockType: "section",
        children: [
          {
            id: "s-inner",
            isBlock: true,
            blockType: "section",
            children: [
              {
                id: "p-1",
                isBlock: true,
                blockType: "paragraph",
                children: [{ isBlock: false, segments: [seg1] }],
              },
              {
                id: "p-2",
                isBlock: true,
                blockType: "paragraph",
                children: [{ isBlock: false, segments: [seg2] }],
              },
            ],
          },
        ],
      },
    ]);
  });

  it("builds div > section > div", () => {
    const schema: BlockSchema = {
      root: "root",
      blocks: {
        root: { blocks: ["div"] },
        div: { blocks: ["section"] },
        section: { blocks: ["div"] },
      },
    };

    const seg1 = seg(0, [
      blk("d-outer", "div"),
      blk("sec-1", "section"),
      blk("d-inner", "div"),
    ]);

    const result = new BlockBuilder(schema).build([seg1]);

    expect(result).toEqual([
      {
        id: "d-outer",
        isBlock: true,
        blockType: "div",
        children: [
          {
            id: "sec-1",
            isBlock: true,
            blockType: "section",
            children: [
              {
                id: "d-inner",
                isBlock: true,
                blockType: "div",
                children: [{ isBlock: false, segments: [seg1] }],
              },
            ],
          },
        ],
      },
    ]);
  });
});

function blk(id: string, blockType: string): BlockSegment {
  return {
    type: "block",
    blockType,
    body: { id },
    startSegment: 0,
    endSegment: 0,
  };
}

function ent(id: string): AnnotationSegment {
  return {
    type: "annotation",
    body: { id },
    depth: 0,
    group: { id: 0, maxDepth: 0 },
    startSegment: 0,
    endSegment: 0,
  };
}

function seg(index: number, annotations: AnnotationSegment[]): Segment {
  return { index, body: "aa", annotations };
}
