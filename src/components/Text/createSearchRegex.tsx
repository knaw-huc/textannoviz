export type SearchHighlights = string;

/**
 * Extracted from TextHighlighting
 * Modified to handle highlight query param
 */
export function createSearchRegex(
  searchTerms: SearchHighlights | undefined,
  tier2: string | undefined,
): RegExp | undefined {
  if (!tier2 || !searchTerms) {
    return;
  }
  // Drop the empty terms that repeated or surrounding spaces leave: an empty
  // alternative matches everywhere, and shadows any term listed after it
  const termsToHighlight = searchTerms.split(" ").filter(Boolean);
  if (!termsToHighlight.length) {
    return;
  }
  const regexTerms = termsToHighlight.map((str) =>
    str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
  );
  return new RegExp(regexTerms.join("|"), "ig");
}
