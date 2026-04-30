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
