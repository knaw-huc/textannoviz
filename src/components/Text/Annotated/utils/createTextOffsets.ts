import { AnnoRepoAnnotation } from "../../../../model/AnnoRepoAnnotation.ts";
import { BlockType, TextOffsets } from "../core";
import { BroccoliRelativeAnno } from "../../../../model/Broccoli.ts";

export function mapRelativePositions(
  relativePositions: BroccoliRelativeAnno[],
): Map<string, BroccoliRelativeAnno> {
  const map = new Map<string, BroccoliRelativeAnno>();
  for (const p of relativePositions) {
    map.set(p.bodyId, p);
  }
  return map;
}

export function createTextOffsets(
  annotation: AnnoRepoAnnotation,
  relativePosition: BroccoliRelativeAnno,
  type: "nested" | "highlight",
): TextOffsets {
  const result = {
    type,
    body: annotation.body,
    begin: relativePosition.begin ?? 0,
    end: relativePosition.end,
  };
  if (result.begin === result.end) {
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
): TextOffsets {
  const startChar = relativePosition.begin ?? 0;
  return {
    type: "marker",
    body: annotation.body,
    begin: startChar,
    end: startChar,
  };
}

export function createBlockTextOffsets(
  annotation: AnnoRepoAnnotation,
  relative: BroccoliRelativeAnno,
  blockType: BlockType,
): TextOffsets {
  return {
    type: "block" as const,
    body: annotation.body,
    begin: relative.begin ?? 0,
    end: relative.end,
    blockType,
  };
}
