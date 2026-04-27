import {
  mapAnnotationSegmentOffsets,
  segment,
  SegmentOffsets,
  TextSegment,
} from "@knaw-huc/text-annotation-segmenter";
import {
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
  const textSegments = segment(body, offsets, (offset) => offset);
  const segmentsByOffsets = mapSegmentsByOffsets(textSegments);
  const allowedDescendantTypes = findDescendantTypes(blockSchema);
  const sortedSegments = textSegments.map((textSegment) => {
    const sorted = sortAnnotations(
      textSegment.annotations,
      segmentsByOffsets,
      allowedDescendantTypes,
    );
    return { ...textSegment, annotations: sorted };
  });
  const groupedSegments = assignGroupToSegments(sortedSegments);
  return groupedSegments;
}

/**
 * Map annotation segments, keyed by object reference.
 * Add type and type-specific segment props.
 */
function mapSegmentsByOffsets(
  textSegments: TextSegment<TextOffsets>[],
): Map<TextOffsets, GrouplessAnnotationSegment> {
  const annotationRanges = mapAnnotationSegmentOffsets(textSegments);
  const result = new Map<TextOffsets, GrouplessAnnotationSegment>();
  for (const [offset, range] of annotationRanges) {
    result.set(offset, toAnnotationSegment(offset, range));
  }
  return result;
}

function toAnnotationSegment(
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
  annotations: TextOffsets[],
  segmentByOffsets: Map<TextOffsets, GrouplessAnnotationSegment>,
  allowedDescendantTypes: Map<BlockType, Set<BlockType>>,
): GrouplessAnnotationSegment[] {
  const markers = annotations
    .filter((a) => a.type === "marker")
    .map((a) => segmentByOffsets.get(a)!);

  const blocks = annotations
    .filter((a) => a.type === "block")
    .sort((a, b) => compareBlocks(a, b, allowedDescendantTypes))
    .map((a) => segmentByOffsets.get(a)!);

  const inlines = annotations
    .filter((a) => a.type !== "marker" && a.type !== "block")
    .sort(bySegmentLength)
    .map((a) => segmentByOffsets.get(a)!);

  return [...markers, ...blocks, ...inlines];
}

function compareBlocks(
  a: TextOffsets,
  b: TextOffsets,
  descendantTypes: Map<BlockType, Set<BlockType>>,
): number {
  const aHasB = descendantTypes.get(a.blockType!)?.has(b.blockType!) ?? false;
  const bHasA = descendantTypes.get(b.blockType!)?.has(a.blockType!) ?? false;
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
function bySegmentLength(a: TextOffsets, b: TextOffsets) {
  return b.end - b.begin - (a.end - a.begin);
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
