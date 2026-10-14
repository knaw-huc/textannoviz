import { BroccoliTextGeneric } from "../../../../model/Broccoli.ts";

/**
 * Marks the element a search hit can be scrolled to.
 *
 * An attribute holding a space-separated list rather than an `id`: one element
 * can be the start of several hits — an entity match and a full-text hit on
 * the same word — and may already carry an `id` of its own, as a ToC header
 * does. Anchors must therefore not contain whitespace.
 */
export const HIT_ANCHORS_ATTRIBUTE = "data-hit-anchors";

/**
 * Anchor of a full-text hit: unique per text and offset.
 *
 * Every rendered text is relative to its own body — the original, the
 * translation and each footnote — so the anchor can be derived from the text
 * alone, both where it is highlighted and where hits are listed, without
 * knowing which panel renders it.
 */
export function createSearchHitAnchor(
  text: BroccoliTextGeneric,
  begin: number,
): string {
  return `search:${text.locations.relativeTo.bodyId}:${begin}`;
}

export function findHitAnchor(anchor: string): Element | null {
  return document.querySelector(
    `[${HIT_ANCHORS_ATTRIBUTE}~="${CSS.escape(anchor)}"]`,
  );
}
