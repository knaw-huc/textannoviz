import { englishLabels } from "../../default/config/englishLabels";

export const englishIsraelsLabels = Object.assign({}, englishLabels, {
  //Search facet titles + metadata panel titles
  institution: "Institution",
  period: "Period",
  msid: "Shelfmark",
  location: "Location",
  correspondent: "Correspondent",
  file: "File",
  letterid: "Letter ID",
  periodlong: "Period (long)",
  type: "Type",

  facetInputFilterPlaceholder: "Search in facet",

  //Text panel titles
  self: "Letter",
  "text.nl": "Main text",
  "text.en": "Translated text",

  //panels
  facs: "Facsimile",
  metadata: "Info",

  //Search item
  letterOriginalText: "Edited text (letter)",
  letterTranslatedText: "Translation (letter)",
  letterNotesText: "Editorial notes (letter)",
  introOriginalText: "Edited text (intro)",
  introTranslatedText: "Translation (intro)",
  introNotesText: "Editorial notes (intro)",
  UNKNOWN: "Unknown document type",
  to: "to",

  //Metadata panel
  NO_NOTES: "This letter contains no notes.",
  letter: "Letter",
  invNr: "Shelfmark",
  addInfo: "Additional information",
  NO_DATA: "No metadata",

  //Metadata panel titles
  notes: "Notes",

  //Visualised annotation categories
  PER: "person",
  ART: "artwork",
  REF: "reference",
});
