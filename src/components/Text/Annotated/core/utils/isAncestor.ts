import { TextSegment } from "@knaw-huc/text-annotation-segmenter";
import { TextPositions } from "../AnnotationModel.ts";
import { MarkerPosition } from "../../../../../model/ProjectConfig.ts";
import { parseXPath } from "./parseXPath.ts";

/**
 * Decide whether a block annotation is an ancestor of a marker
 * by using xpaths or character offsets.
 */
export function isAncestor(
  block: TextPositions,
  segment: TextSegment<TextPositions>,
  xpath: string | undefined,
  markerPosition: MarkerPosition = "postfix",
): boolean {
  if (xpath) {
    if (isXpathAncestor(block, xpath)) {
      return true;
    }

    const tagOccursInMarkerPath = parseXPath(xpath).some(
      (step) => step.tag === block.body.elementName,
    );
    if (tagOccursInMarkerPath) {
      return false;
    }
  }

  /**
   * Fall back to offsets:
   * - Pages do not appear in xpaths.
   * - When marker has no xpath
   */
  return markerPosition === "prefix"
    ? block.end > segment.start
    : block.start < segment.start;
}

function isXpathAncestor(block: TextPositions, xpath: string): boolean {
  const markerSteps = parseXPath(xpath);
  const blockSteps = block.xpath ? parseXPath(block.xpath) : [];
  if (!blockSteps.length) {
    return false;
  }
  return blockSteps.every(
    (step, i) =>
      markerSteps[i]?.tag === step.tag && markerSteps[i]?.index === step.index,
  );
}
