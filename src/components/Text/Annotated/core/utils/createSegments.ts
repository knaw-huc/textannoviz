import {
  findSegmentOffsets,
  segment,
  SegmentOffsets,
} from "@knaw-huc/text-annotation-segmenter";
import {
  BlockAnnotationSegment,
  BlockType,
  GrouplessAnnotationSegment,
  Segment,
  TextOffsets,
} from "../AnnotationModel.ts";
import { assignGroupToSegments } from "./assignGroupToSegments.ts";
import { BlockSchema } from "../block";

/**
 * Split a text into {@link Segment}s using annotation character offsets.
 *
 * Each segment contains the text and a sorted list of annotation segments:
 * markers first, then remaining annotations sorted largest-first (so smallest nest deepest).
 */
export function createSegments(
  body: string,
  offsets: TextOffsets[],
  blockSchema: BlockSchema,
): Segment[] {
  const segments = segment(body, offsets, (offset) => offset);
  const segmentOffsetsMap = findSegmentOffsets(segments);
  const withSegmentOffsets = new Map<TextOffsets, GrouplessAnnotationSegment>();
  for (const [textOffsets, segmentOffsets] of segmentOffsetsMap) {
    const segment = addSegmentTypeProps(textOffsets, segmentOffsets);
    withSegmentOffsets.set(textOffsets, segment);
  }

  const allowedDescendantTypes = findDescendantTypes(blockSchema);
  const sortedSegments = segments.map((textSegment) => ({
    ...textSegment,
    annotations: sortAnnotations(
      textSegment.annotations.map((a) => withSegmentOffsets.get(a)!),
      allowedDescendantTypes,
    ),
  }));

  return assignGroupToSegments(sortedSegments);
}

function addSegmentTypeProps(
  textOffsets: TextOffsets,
  segmentOffsets: SegmentOffsets,
): GrouplessAnnotationSegment {
  const base = { ...segmentOffsets, ...textOffsets };
  if (textOffsets.type === "block") {
    return { ...base, blockType: textOffsets.blockType! };
  } else if (textOffsets.type === "marker") {
    return { ...base, type: "marker", endSegment: base.beginSegment };
  } else {
    return { ...base, type: textOffsets.type };
  }
}

/**
 * Sort annotations:
 * - markers: before blocks and inlines
 * - blocks: parents before children, longest first
 * - inlines: longest first
 */
function sortAnnotations(
  annotations: GrouplessAnnotationSegment[],
  allowedDescendantTypes: Map<BlockType, Set<BlockType>>,
): GrouplessAnnotationSegment[] {
  const markers: GrouplessAnnotationSegment[] = [];
  const blocks: GrouplessAnnotationSegment[] = [];
  const inlines: GrouplessAnnotationSegment[] = [];

  for (const a of annotations) {
    if (a.type === "marker") {
      markers.push(a);
    } else if (a.type === "block") {
      blocks.push(a);
    } else {
      inlines.push(a);
    }
  }

  blocks.sort((a, b) =>
    compareBlocks(
      a as BlockAnnotationSegment,
      b as BlockAnnotationSegment,
      allowedDescendantTypes,
    ),
  );
  inlines.sort(bySegmentLength);

  return [...markers, ...blocks, ...inlines];
}

function compareBlocks(
  a: BlockAnnotationSegment,
  b: BlockAnnotationSegment,
  descendantTypes: Map<BlockType, Set<BlockType>>,
): number {
  const aHasB = descendantTypes.get(a.blockType)?.has(b.blockType) ?? false;
  const bHasA = descendantTypes.get(b.blockType)?.has(a.blockType) ?? false;
  if (aHasB && !bHasA) {
    return -1;
  }
  if (bHasA && !aHasB) {
    return 1;
  }
  return bySegmentLength(a, b);
}

/**
 * Nest smallest annotations deepest
 */
function bySegmentLength(
  a: GrouplessAnnotationSegment,
  b: GrouplessAnnotationSegment,
) {
  return b.endSegment - b.beginSegment - (a.endSegment - a.beginSegment);
}

/**
 * Find allowed block types of children and further descendants
 */
function findDescendantTypes(
  schema: BlockSchema,
): Map<BlockType, Set<BlockType>> {
  const found = new Map<BlockType, Set<BlockType>>();

  function findNested(type: BlockType): Set<BlockType> {
    if (found.has(type)) {
      return found.get(type)!;
    }
    const descendants = new Set<BlockType>();
    found.set(type, descendants);
    for (const child of schema.blocks[type]?.children ?? []) {
      descendants.add(child);
      for (const descendant of findNested(child)) {
        descendants.add(descendant);
      }
    }
    return descendants;
  }

  for (const type of Object.keys(schema.blocks)) {
    findNested(type);
  }
  findNested(schema.root);
  return found;
}
