import {
  filterSegmentAnnotations,
  findSegmentRange,
  segment,
  SegmentRange,
} from "@knaw-huc/text-annotation-segmenter";
import {
  BlockAnnotationSegment,
  BlockType,
  GrouplessAnnotationSegment,
  Segment,
  TextPositions,
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
  offsets: TextPositions[],
  blockSchema: BlockSchema,
): Segment[] {
  const getOffsets = (offset: TextPositions) => offset;
  const segments = segment(body, offsets, getOffsets);

  /**
   * Filter marker annotations, so markers are grouped into the correct blocks
   * and not into bordering entity groups.
   */
  const filtered = filterSegmentAnnotations(segments, (annotation, segment) => {
    // Skip non-marker segments:
    if (segment.start !== segment.end) {
      return true;
    }

    // keep marker annotations:
    if (annotation.type === "marker") {
      return true;
    }

    const marker = segment.annotations.find((a) => a.type === "marker");

    /**
     * Keep block annotations according to configured marker position:
     * - postfix: keep blocks ending at marker (e.g. note at the end of a paragraph)
     * - prefix: keep blocks starting at marker (e.g. a header prefix)
     */
    const markerPosition = marker?.markerPosition ?? "postfix";
    if (annotation.type === "block") {
      return markerPosition === "prefix"
        ? annotation.end > segment.start
        : annotation.start < segment.start;
    }

    /**
     * Entity groups ending with a marker should not include that marker,
     * so inline annotations are removed that only border the marker:
     */
    return annotation.start < segment.start && annotation.end > segment.start;
  });

  const segmentRangesMap = findSegmentRange(filtered);

  const withSegmentOffsets = new Map<
    TextPositions,
    GrouplessAnnotationSegment
  >();
  for (const [textOffsets, segmentOffsets] of segmentRangesMap) {
    const segment = addSegmentTypeProps(textOffsets, segmentOffsets);
    withSegmentOffsets.set(textOffsets, segment);
  }

  const allowedDescendantTypes = findDescendantTypes(blockSchema);
  const sortedSegments = filtered.map((textSegment) => ({
    ...textSegment,
    annotations: sortAnnotations(
      textSegment.annotations.map((a) => withSegmentOffsets.get(a)!),
      allowedDescendantTypes,
    ),
  }));
  return assignGroupToSegments(sortedSegments);
}

function addSegmentTypeProps(
  textOffsets: TextPositions,
  segmentRange: SegmentRange,
): GrouplessAnnotationSegment {
  const base = { ...segmentRange, ...textOffsets };
  if (textOffsets.type === "block") {
    return { ...base, blockType: textOffsets.blockType! };
  } else if (textOffsets.type === "marker") {
    return { ...base, type: "marker", endSegment: base.startSegment };
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
  return b.endSegment - b.startSegment - (a.endSegment - a.startSegment);
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
