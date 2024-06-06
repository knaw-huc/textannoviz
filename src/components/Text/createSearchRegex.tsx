export type SearchHighlights = {
  exact: boolean;
  map: Map<string, string[]>;
};

/**
 * Extracted from TextHighlighting
 */
export function createSearchRegex(
  textToHighlight: SearchHighlights,
  tier2: string | undefined,
): RegExp | undefined {
  if (textToHighlight.map.size === 0 || !tier2) {
    return;
  }
  const toHighlight: string[] | undefined = textToHighlight.map.get(tier2);
  if (!toHighlight) {
    return;
  }
  const regexStrings = toHighlight.map((str) =>
    str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
  );
  let joinedRegexString: string | undefined = "";

  textToHighlight.exact
    ? (joinedRegexString = regexStrings?.join("\\s"))
    : (joinedRegexString = regexStrings?.join("|"));
  return new RegExp(`${joinedRegexString}`, "g");
}
