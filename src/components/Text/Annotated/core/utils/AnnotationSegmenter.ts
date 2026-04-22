import {
  segment,
  TextSegment as TextSegment,
  AnnotationOffsets,
  Offsets,
} from "@knaw-huc/text-annotation-segmenter";
import {
  GrouplessAnnotationSegment,
  GrouplessSegment,
  TextOffsets,
} from "../AnnotationModel.ts";

/**
 * A {@link TextOffsets} range marks an annotation with begin and end character offsets.
 * All offsets together result in a text split up into a list of {@link GrouplessSegment}s.
 * A Segment also contains a list of annotations that apply to that text segment.
 * When a text segment contains no annotations, the segment annotation list will be empty.
 */
export class AnnotationSegmenter {
  private cache = new Map<TextOffsets, GrouplessAnnotationSegment>();

  constructor(
    private body: string,
    private offsets: TextOffsets[],
  ) {}

  public segment(): GrouplessSegment[] {
    // TODO: why not pass in AnnotationOffsets<TextOffsets>[], to prevent any unneeded mapping?
    const mapped: AnnotationOffsets<TextOffsets>[] = this.offsets.map((o) => ({
      begin: o.begin,
      end: o.end,
      body: o,
    }));

    const segments = segment(this.body, mapped);
    const spans = this.createSegmentOffsets(segments);
    return segments.map((s, index) => {
      const annotations = this.toAnnotationSegments(s.annotations, spans);
      return { ...s, index, annotations };
    });
  }

  private toAnnotationSegments(
    annotations: TextOffsets[],
    spans: Map<string, Offsets>,
  ): GrouplessAnnotationSegment[] {
    const markers = annotations
      .filter((a) => a.type === "marker")
      .map((a) => this.getOrCreate(a, spans));
    const rest = annotations
      .filter((a) => a.type !== "marker")
      .sort(byAnnotationSize)
      .map((a) => this.getOrCreate(a, spans));
    return [...markers, ...rest];
  }

  private getOrCreate(
    offset: TextOffsets,
    spans: Map<string, Offsets>,
  ): GrouplessAnnotationSegment {
    const existing = this.cache.get(offset);
    if (existing) {
      return existing;
    }
    const created = this.toAnnotationSegment(offset, spans);
    this.cache.set(offset, created);
    return created;
  }

  // TODO: Is this really needed? Cannot we do without in textannoviz?
  private createSegmentOffsets(
    segments: TextSegment<TextOffsets>[],
  ): Map<string, Offsets> {
    const offsets = new Map<string, Offsets>();
    for (let i = 0; i < segments.length; i++) {
      for (const offset of segments[i].annotations) {
        const id = offset.body.id;
        const existing = offsets.get(id);
        if (!existing) {
          offsets.set(id, { begin: i, end: i + 1 });
        } else {
          existing.end = i + 1;
        }
      }
    }
    return offsets;
  }

  private toAnnotationSegment(
    offset: TextOffsets,
    spans: Map<string, Offsets>,
  ): GrouplessAnnotationSegment {
    const span = spans.get(offset.body.id) ?? { begin: 0, end: 0 };
    const base = {
      body: offset.body,
      startSegment: span.begin,
      endSegment: span.end,
    };

    if (offset.type === "block") {
      return { ...base, type: "block", blockType: offset.blockType! };
    }
    if (offset.type === "highlight") {
      return { ...base, type: "highlight" };
    }
    if (offset.type === "nested") {
      return { ...base, type: "nested" };
    }
    if (offset.type === "marker") {
      return {
        type: "marker",
        body: offset.body,
        startSegment: span.begin,
        endSegment: span.begin,
      };
    }
    throw new Error("Unknown offset type: " + offset.type);
  }
}

/**
 * Nest smallest annotations deepest
 */
function byAnnotationSize(a: TextOffsets, b: TextOffsets) {
  return b.end - b.begin - (a.end - a.begin);
}
