import { describe, expect, it } from "vitest";
import { BlockBuilder, BlockSchema } from "./BlockBuilder.ts";
import {
  AnnotationSegment,
  BlockAnnotationSegment,
  Segment,
  SegmentIndex,
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
    const pB = blk("p-B", "paragraph");
    const secBC = blk("s-BC", "section");
    const segB = seg(1, [ent("e-AB"), ent("e-BC"), pB, secBC]);
    const pC = blk("p-C", "paragraph");
    const segC = seg(2, [ent("e-BC"), pC, secBC]);
    const segD = seg(3, []);
    const secE = blk("s-E", "section");
    const segE = seg(4, [secE]);

    const segments = [segA, segB, segC, segD, segE];
    const result = new BlockBuilder(blockSchema).build(segments);

    expect(result).toEqual([
      { isBlock: false, segments: [segA] },
      {
        id: "s-BC",
        isBlock: true,
        blockType: "section",
        annotation: secBC,
        children: [
          {
            id: "p-B",
            isBlock: true,
            blockType: "paragraph",
            children: [{ isBlock: false, segments: [segB] }],
            annotation: pB,
          },
          {
            id: "p-C",
            isBlock: true,
            blockType: "paragraph",
            children: [{ isBlock: false, segments: [segC] }],
            annotation: pC,
          },
        ],
      },
      { isBlock: false, segments: [segD] },
      {
        id: "s-E",
        isBlock: true,
        blockType: "section",
        annotation: secE,
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

    const sOuter = blk("s-outer", "section");
    const sInner = blk("s-inner", "section");
    const p1 = blk("p-1", "paragraph");
    const p2 = blk("p-2", "paragraph");

    const seg1 = seg(0, [sOuter, sInner, p1]);
    const seg2 = seg(1, [sOuter, sInner, p2]);

    const result = new BlockBuilder(schema).build([seg1, seg2]);

    expect(result).toEqual([
      {
        id: "s-outer",
        isBlock: true,
        blockType: "section",
        annotation: sOuter,
        children: [
          {
            id: "s-inner",
            isBlock: true,
            blockType: "section",
            annotation: sInner,
            children: [
              {
                id: "p-1",
                isBlock: true,
                blockType: "paragraph",
                annotation: p1,
                children: [{ isBlock: false, segments: [seg1] }],
              },
              {
                id: "p-2",
                isBlock: true,
                blockType: "paragraph",
                annotation: p2,
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

    const dOuter = blk("d-outer", "div");
    const sec1 = blk("sec-1", "section");
    const dInner = blk("d-inner", "div");

    const seg1 = seg(0, [dOuter, sec1, dInner]);

    const result = new BlockBuilder(schema).build([seg1]);

    expect(result).toEqual([
      {
        id: "d-outer",
        isBlock: true,
        blockType: "div",
        annotation: dOuter,
        children: [
          {
            id: "sec-1",
            isBlock: true,
            blockType: "section",
            annotation: sec1,
            children: [
              {
                id: "d-inner",
                isBlock: true,
                blockType: "div",
                annotation: dInner,
                children: [{ isBlock: false, segments: [seg1] }],
              },
            ],
          },
        ],
      },
    ]);
  });

  it("picks first div as parent of second div", () => {
    const schema: BlockSchema = {
      root: "root",
      blocks: {
        root: { blocks: ["div"] },
        div: { blocks: ["div"] },
      },
    };

    const d1 = blk("d1", "div");
    const d2 = blk("d2", "div");
    const seg1 = seg(0, [d1, d2]);

    const result = new BlockBuilder(schema).build([seg1]);

    expect(result).toEqual([
      {
        id: "d1",
        isBlock: true,
        blockType: "div",
        annotation: d1,
        children: [
          {
            id: "d2",
            isBlock: true,
            blockType: "div",
            annotation: d2,
            children: [{ isBlock: false, segments: [seg1] }],
          },
        ],
      },
    ]);
  });
});

function blk(id: string, blockType: string): BlockAnnotationSegment {
  return {
    type: "block",
    body: { id },
    blockType,
    startSegment: 0,
    endSegment: 0,
  };
}

function ent(id: string): AnnotationSegment {
  return {
    type: "nested",
    body: { id },
    depth: 0,
    group: { id: 0, maxDepth: 0 },
    startSegment: 0,
    endSegment: 0,
  };
}

function seg(index: SegmentIndex, annotations: AnnotationSegment[]): Segment {
  return { index, begin: 0, end: 2, body: "aa", annotations };
}
