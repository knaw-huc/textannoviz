import {
  BlockSegment,
  BlockType,
  Body,
  isBlockAnnotationSegment,
  Segment,
} from "../AnnotationModel.ts";
import { Block, Element, Inline } from "./BlockModel.ts";

type BlockConfig = {
  blocks: BlockType[];
};

export type BlockSchema = {
  root: BlockType;
  blocks: Record<BlockType, BlockConfig>;
};

type GroupedSegments<T extends Body> = {
  block?: BlockSegment<T>;
  segments: Segment[];
};

type SegmentIndex = number;

/**
 * Loop through segments, dequeue annotation after building a block
 */
type AnnotationQueue<T extends Body> = Map<
  SegmentIndex,
  Map<BlockType, BlockSegment<T>[]>
>;

export class BlockBuilder<T extends Body = Body> {
  constructor(private readonly config: BlockSchema) {
    if (!(config.root in config.blocks)) {
      throw new Error("No root in block config found");
    }
  }

  build(segments: Segment[]): Element[] {
    const queue = this.createBlockQueue(segments);
    return this.createBlocks(segments, this.config.root, queue);
  }

  private createBlockQueue(segments: Segment[]): AnnotationQueue<T> {
    const queue: AnnotationQueue<T> = new Map();
    for (const segment of segments) {
      const types = new Map<BlockType, BlockSegment<T>[]>();
      for (const annotation of segment.annotations) {
        if (isBlockAnnotationSegment(annotation)) {
          const block = annotation;
          const list = types.get(block.blockType) ?? [];
          list.push(block as BlockSegment<T>);
          types.set(block.blockType, list);
        }
      }
      if (types.size) {
        queue.set(segment.index, types);
      }
    }
    return queue;
  }

  private createBlocks(
    segments: Segment[],
    parent: BlockType,
    queue: AnnotationQueue<T>,
  ): Element[] {
    if (!segments.length) {
      return [];
    }
    const allowed = this.config.blocks[parent]?.blocks ?? [];
    if (!allowed.length) {
      return [this.createInline(segments)];
    }
    const groupedSegments = this.groupSegmentsByBlock(segments, allowed, queue);
    return groupedSegments.map((group) =>
      group.block
        ? this.createBlock(group.block, group.segments, queue)
        : this.createInline(group.segments),
    );
  }

  private groupSegmentsByBlock(
    segments: Segment[],
    allowed: BlockType[],
    queue: AnnotationQueue<T>,
  ): GroupedSegments<T>[] {
    const groups: GroupedSegments<T>[] = [];
    let currentId: string | undefined;
    let currentGroup: GroupedSegments<T> | undefined;

    for (const segment of segments) {
      const block = this.dequeue(queue, allowed, segment);
      if (block?.body.id !== currentId || !currentGroup) {
        currentGroup = block
          ? { block, segments: [segment] }
          : { segments: [segment] };
        groups.push(currentGroup);
        currentId = block?.body.id;
      } else {
        currentGroup.segments.push(segment);
      }
    }
    return groups;
  }

  private dequeue(
    queue: AnnotationQueue<T>,
    childTypes: BlockType[],
    segment: Segment,
  ): BlockSegment<T> | undefined {
    const types = queue.get(segment.index);
    if (!types) {
      return undefined;
    }
    for (const childType of childTypes) {
      const annotations = types.get(childType);
      if (annotations?.length) {
        return annotations.shift();
      }
    }
    return undefined;
  }

  private createBlock(
    annotation: BlockSegment<T>,
    segments: Segment[],
    queue: AnnotationQueue<T>,
  ): Block {
    return {
      isBlock: true,
      id: annotation.body.id,
      blockType: annotation.blockType,
      annotation,
      children: this.createBlocks(segments, annotation.blockType, queue),
    };
  }

  private createInline(segments: Segment[]): Inline {
    return { isBlock: false, segments };
  }
}
