import { TextSegment } from "@knaw-huc/text-annotation-segmenter";
import { TextPositions } from "../AnnotationModel.ts";

/**
 * Split segments with multiple markers into multiple segments with a single marker,
 * so every marker can be grouped and nested according to its xpath.
 */
export function splitMarkerSegments(
  segments: TextSegment<TextPositions>[],
): TextSegment<TextPositions>[] {
  const result: TextSegment<TextPositions>[] = [];
  for (const segment of segments) {
    const markers = segment.annotations.filter((a) => a.type === "marker");
    if (segment.start !== segment.end || markers.length <= 1) {
      result.push(segment);
      continue;
    }

    const others = segment.annotations.filter((a) => a.type !== "marker");
    for (const marker of markers) {
      result.push({ ...segment, annotations: [marker, ...others] });
    }
  }
  return result.map((segment, index) => ({ ...segment, index }));
}
