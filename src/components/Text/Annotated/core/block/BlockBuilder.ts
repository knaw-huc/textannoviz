import {
  BlockAnnotationSegment,
  Body,
  isBlockAnnotationSegment,
  Segment,
} from "../AnnotationModel.ts";
import { Block, Element, Inline } from "./BlockModel.ts";

type GroupedSegments<T extends Body> = {
  block?: BlockAnnotationSegment<T>;
  segments: Segment[];
};

export class BlockBuilder<T extends Body = Body> {
  build(segments: Segment[]): Element[] {
    return this.createElements(segments, 0);
  }

  private createElements(
    segments: Segment[],
    annotationIndex: number,
  ): Element[] {
    const groups = this.groupSegmentsByBlock(segments, annotationIndex);
    return groups.map((group) =>
      group.block
        ? this.createBlock(group.block, group.segments, annotationIndex)
        : this.createInline(group.segments),
    );
  }

  private groupSegmentsByBlock(
    segments: Segment[],
    annotationIndex: number,
  ): GroupedSegments<T>[] {
    const groups: GroupedSegments<T>[] = [];
    let currentId: string | undefined;
    let currentGroup: GroupedSegments<T> | undefined;

    for (const segment of segments) {
      const block = this.getBlockAt(segment, annotationIndex);
      const id = block?.body.id;

      if (id !== currentId || !currentGroup) {
        currentGroup = block
          ? { block, segments: [segment] }
          : { segments: [segment] };
        groups.push(currentGroup);
        currentId = id;
      } else {
        currentGroup.segments.push(segment);
      }
    }
    return groups;
  }

  private getBlockAt(
    segment: Segment,
    annotationIndex: number,
  ): BlockAnnotationSegment<T> | undefined {
    let blockIndex = 0;
    for (const annotation of segment.annotations) {
      if (isBlockAnnotationSegment<T>(annotation)) {
        if (blockIndex === annotationIndex) {
          return annotation;
        }
        blockIndex++;
      }
    }
    return;
  }

  private createBlock(
    annotation: BlockAnnotationSegment<T>,
    segments: Segment[],
    annotationIndex: number,
  ): Block {
    return {
      isBlock: true,
      id: annotation.body.id,
      blockType: annotation.blockType,
      annotation,
      children: this.createElements(segments, annotationIndex + 1),
    };
  }

  private createInline(segments: Segment[]): Inline {
    return { isBlock: false, segments };
  }
}
