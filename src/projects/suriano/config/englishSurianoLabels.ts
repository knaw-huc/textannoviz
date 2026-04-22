import { englishLabels } from "../../default/config/englishLabels";

export const englishSurianoLabels = Object.assign({}, englishLabels, {
  //Text panel titles
  self: "Main text + secretarial + appendix",
  "text.it": "Main text + secretarial + appendix",
  appendix: "Appendix",
  original: "Main text without secretarial and appendix",
  secretarial: "Secretarial",
  text: "Text",
  info: "Info",
  intro: "Introduction",
  help: "Help",

  notes: "Notes",
  artworks: "Artworks",

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
  file: "Letter ID",
  type: "Type",
  title: "Title",
  letter: "Letter",

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
  NO_ARTWORKS: "No artworks in this letter",
  SHOW_PAGE: "Show facsimile",
  NO_NOTES: "This letter contains no notes.",

  // Facet Help Texts
  SEARCH_IN_HELP:
    "Use this control to limit your search to specific parts of the edition: the original texts, translations, or editorial notes in the letters or the introductory texts.",
  DATE_HELP:
    "Filter by the date when a letter was written. For those letters for which the precise date of writing is unknown, they are included in the search results when they might have been written in the selected period. The display of the date (day-month or month-day) is determined by your computer or browser settings).",
  VIEW_HELP:
    "Use the View Options in the bottom right of the window to show or hide elements such as transcription, translation, metadata, or facsimile. Hidden elements are greyed out.",
  SENDER_HELP:
    "TODO: add help text for Sender facet in projects/suriano/englishSurianoLabels.ts",
  RECIPIENT_HELP:
    "TODO: add help text for Recipient facet in projects/suriano/englishSurianoLabels.ts",
  PERSONS_HELP:
    "Filter by individual(s) mentioned in the letters, the editorial notes, and the introduction. Use the search field at the top of the facet to find a specific person by name. Selecting a name will show only the document(s) in which this person is referenced. You can select multiple names at once; this will return documents where one of the selected persons is mentioned. Uncheck a name to remove it from your selection.",
});
