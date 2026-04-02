import { englishLabels } from "../../default/config/englishLabels";

export const englishSurianoLabels = Object.assign({}, englishLabels, {
  //Text panel titles
  self: "Main text + secretarial + appendix",
  text: "Main text + secretarial",
  appendix: "Appendix",
  original: "Main text without secretarial and appendix",
  secretarial: "Secretarial",
  notes: "Notes",

  // search facet titles:
  bodyType: "Document type",
  "tf:File": "Letter",
  dateSent: "Date sent",
  fromLocation: "Location of sender",
  sender: "Sender",
  recipient: "Recipient",
  toLocation: "Location of recipient",
  persons: "Persons",
  addInfo: "Summary",

  //Metadata panel
  summary: "Summary",
  shelfmark: "Shelfmark",

  // search results:
  results: "letters",

  PER: "person",

  page: "f.",

  "PRIMARY NAME": "Primary name",
  "OCCUPATIONS, ROLES, and/or TITLES": "Occupations, roles, titles",
  "BIRTH YEAR": "Date of birth",
  "DEATH YEAR": "Date of death",
  "GENERAL NOTES ON PERSON": "General notes",
  "RELATED RESOURCE NAME": "Related resource",
  "RELATED RESOURCE URL": "Related resource url",

  TITLE_PT_1: "Correspondence of",
  TITLE_PT_2: "SURIANO",
  SEARCH_IN: "Search in",
  letterOriginalText: "Letters",
  letterNotesText: "Letter notes",
});
