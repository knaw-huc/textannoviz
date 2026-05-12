import { AnnoRepoAnnotation } from "../../../../model/AnnoRepoAnnotation.ts";
import { BlockType, TextPositions } from "../core";
import { BroccoliRelativeAnno } from "../../../../model/Broccoli.ts";
import { MarkerPosition } from "../../../../model/ProjectConfig.ts";

export function createTextOffsets(
  annotation: AnnoRepoAnnotation,
  relativePosition: BroccoliRelativeAnno,
  type: "nested" | "highlight",
): TextPositions {
  const result = {
    type,
    body: annotation.body,
    start: relativePosition.begin ?? 0,
    end: relativePosition.end,
  };
  if (result.start === result.end) {
    throw new Error(`Should not be marker: ${JSON.stringify(annotation.body)}`);
  }
  return result;
}

/**
 * Mark start of page using end offset
 */
export function createMarkerTextOffsets(
  annotation: AnnoRepoAnnotation,
  relativePosition: BroccoliRelativeAnno,
  markerPosition?: MarkerPosition,
): TextPositions {
  const startChar = relativePosition.begin ?? 0;
  return {
    type: "marker",
    body: annotation.body,
    start: startChar,
    end: startChar,
    markerPosition,
  };
}

export function createBlockTextOffsets(
  annotation: AnnoRepoAnnotation,
  relative: BroccoliRelativeAnno,
  blockType: BlockType,
): TextPositions {
  return {
    type: "block" as const,
    body: annotation.body,
    start: relative.begin ?? 0,
    end: relative.end,
    blockType,
  };
}
