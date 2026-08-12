import { formatLetterNumber, letterIdToPath } from "./letterIdToPath";

export type AdjacentLetter = {
  /** Where the link navigates to */
  path: string;
  /** The letter number as cited, shown in the link */
  number: string;
};

/**
 * Find the letters either side of the current one.
 *
 * Prev/next follow the order of {@link letterIds}, which is the order the
 * letter id endpoint returned them in — not a sort applied here.
 * {@link letterIds} is expected to be lowercase, as {@link current} is
 * lowercased before lookup.
 */
export function getAdjacentLetterPaths(
  letterIds: string[] | undefined,
  current: string | undefined,
  baseUrl: string,
): { prev?: AdjacentLetter; next?: AdjacentLetter } {
  if (!current || !letterIds) return {};
  const index = letterIds.indexOf(current.toLowerCase());
  if (index === -1) return {};
  return {
    prev:
      index > 0 ? toAdjacentLetter(letterIds[index - 1], baseUrl) : undefined,
    next:
      index < letterIds.length - 1
        ? toAdjacentLetter(letterIds[index + 1], baseUrl)
        : undefined,
  };
}

function toAdjacentLetter(letterId: string, baseUrl: string): AdjacentLetter {
  return {
    path: letterIdToPath(letterId, baseUrl),
    number: formatLetterNumber(letterId),
  };
}
