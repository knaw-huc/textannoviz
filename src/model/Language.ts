import { Labels } from "./Labels.ts";

export type LanguageCode = "en" | "nl";
const languageCodes = ["en", "nl"];
export function isValidLanguageCode(code: string): code is LanguageCode {
  return languageCodes.includes(code);
}

export type Language = {
  code: LanguageCode;
  labels: Labels;
};
