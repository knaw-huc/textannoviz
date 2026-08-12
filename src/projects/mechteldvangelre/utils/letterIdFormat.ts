import { LetterIdFormat } from "../../../model/ProjectConfig";

/**
 * Mechteld van Gelre letter ids are unpadded numbers ('1', '10', '192') and are
 * cited as such, but their urns are prefixed and zero-padded to 3 digits:
 * 'urn:mace:huc.knaw.nl:mechteldvangelre:brief_010'.
 */
export const mechteldvangelreLetterIdFormat: LetterIdFormat = {
  toUrnSuffix: (letterId) => `brief_${letterId.padStart(3, "0")}`,
  toNumber: (letterId) => letterId,

  // Ids are unpadded, but letters are cited zero-padded in their urn, so accept
  // both: '012' > '12'. Anything else is left untouched and handled as a
  // regular full text search.
  fromInput: (input) => input.replace(/^0+(?=\d)/, ""),
};
