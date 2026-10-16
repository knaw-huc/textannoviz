import { LetterIdFormat } from "../../../model/ProjectConfig";

/**
 * Mechteld van Gelre letter ids are zero-padded to 3 digits ('001', '010',
 * '192'), and are cited as such, matching their urns:
 * 'urn:mace:huc.knaw.nl:mechteldvangelre:brief_010'.
 */
export const mechteldvangelreLetterIdFormat: LetterIdFormat = {
  toUrnSuffix: (letterId) => `brief_${letterId}`,
  toNumber: (letterId) => letterId,

  // Ids are padded, but a user is likely to type a plain number, so accept
  // both: '12' > '012'. Anything that is not a number is left untouched and
  // handled as a regular full text search.
  fromInput: (input) =>
    /^\d+$/.test(input)
      ? input.replace(/^0+(?=\d)/, "").padStart(3, "0")
      : input,
};
