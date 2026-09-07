import { LetterIdFormat } from "../../../model/ProjectConfig";

/**
 * Van Gogh letter ids are stored lowercase and zero-padded ('001', '001a',
 * 'rm01'), while 'RM' letters are cited uppercase and regular letters live at
 * urns prefixed with 'let'.
 */
export const vangoghLetterIdFormat: LetterIdFormat = {
  toUrnSuffix: (letterId) =>
    isRmLetter(letterId) ? letterId.toUpperCase() : `let${letterId}`,

  toNumber: (letterId) =>
    isRmLetter(letterId) ? letterId.toUpperCase() : letterId,

  fromInput: (input) => {
    // 'RM' letters are zero-padded to 2 digits, so 'rm1' > 'rm01' (until rm25).
    const rmMatch = input.match(/^rm(\d+)$/);
    if (rmMatch) {
      return "rm" + rmMatch[1].padStart(2, "0");
    }

    // Regular letters are zero-padded to 3 digits, so '1' > '001' and '1a' > '001a'.
    // Anything else is left untouched and handled as a regular full text search.
    return input.replace(
      /^(\d+)([a-z]*)$/,
      (_, digits, suffix) => digits.padStart(3, "0") + suffix,
    );
  },
};

function isRmLetter(letterId: string) {
  return letterId.startsWith("rm");
}
