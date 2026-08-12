/**
 * Letter ids are stored lowercase, but 'RM' letters are cited uppercase.
 * Below is Van Gogh specific!
 */
export function formatLetterNumber(letterId: string) {
  return letterId.startsWith("rm") ? letterId.toUpperCase() : letterId;
}

export function letterIdToPath(letterId: string, baseUrl: string) {
  // Below is Van Gogh specific!
  return letterId.startsWith("rm")
    ? `${baseUrl}${formatLetterNumber(letterId)}`
    : `${baseUrl}let${letterId}`;
}
