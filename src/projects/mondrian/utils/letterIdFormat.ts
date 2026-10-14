import { LetterIdFormat } from "../../../model/ProjectConfig";

export const mondrianLetterIdFormat: LetterIdFormat = {
  toUrnSuffix: (letterId) => letterId,
  toNumber: (letterId) => letterId,

  fromInput: (input) =>
    input.replace(
      /^(\d+)([a-z]*)$/,
      (_, digits, suffix) => digits.padStart(4, "0") + suffix,
    ),
};
