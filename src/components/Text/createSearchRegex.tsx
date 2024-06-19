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
  const termsToHighlight = searchTerms.split(" ");
  const regexTerms = termsToHighlight.map((str) =>
    str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
  );
  return new RegExp(regexTerms?.join("|"), "ig");
}
