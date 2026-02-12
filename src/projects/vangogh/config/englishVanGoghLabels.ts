import { englishLabels } from "../../default/config/englishLabels";

export const englishVangoghLabels = Object.assign({}, englishLabels, {
  //Search facet titles + metadata panel titles
  institution: "Institution",
  msid: "Shelfmark",
  location: "Location",
  recipient: "Recipient",
  sender: "Sender",
  file: "Letter number",
  letterid: "Letter ID",
  periodlong: "Period (long)",
  type: "Type",
  artworksEN: "Artworks",

  facetInputFilterPlaceholder: "Search in facet",

  SEARCH_IN: "Search in",

  //Text panel titles
  self: "Letter",
  "text.nl": "Main text",
  "text.en": "Translated text",

  //panels
  facs: "Facsimile",
  metadata: "Info",

  //Footer
  NAVIGATE_SEARCH_RESULTS: "Navigate search results",
  SEARCH: "Search",

  page: "Page",
  SHOW_PAGE: "Show page",

  //Search item
  letterOriginalText: "Edited text (letter)",
  letterTranslatedText: "Translation (letter)",
  letterNotesText: "Editorial notes (letter)",
  introOriginalText: "Text (about)",
  // introNotesText: "Editorial notes (about)",
  UNKNOWN: "Unknown document type",
  to: "to",
  intro: "About this edition",
  LET_NUM: "Letter number",
  results: "results",

  //Metadata panel
  NO_NOTES: "This letter contains no notes.",
  NO_ARTWORKS: "No artworks in this letter.",
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

  //Header
  persons: "Persons",
  artworks: "Artworks",
  introHeader: "About this edition",
  bibliography: "Bibliography",
  TITLE_PT_1: "Vincent van Gogh",
  TITLE_PT_2: "The Letters",
  help: "Help",

  //Entity summary
  NAV_TO_LETTER: "Navigate to letter",

  //Entity labels
  artist: "Artist",
  date: "Date",
  size: "Dimensions",
  support: "Medium",
  collection: "Collection",
  credits: "Credits",

  //Search info page
  INFO_TITLE: "The letters of Vincent van Gogh",
  EDITED_BY: "",
  P1: "",
  P2: "",
  SCROLL_TO_LETTERS: "Explore the letters",

  //Help labels
  SEARCH_IN_HELP:
    "Use this control to limit your search to specific parts of the edition: the original texts, translations, or editorial notes in the letters or the introductory texts.",
  LANG_MENU_HELP:
    "Toggle between Dutch and English. This applies to both the interface and the content of the edition.",
  VIEW_HELP:
    "Use the View Options in the bottom right of the window to show or hide elements such as transcription, translation, metadata, or facsimile. Hidden elements are greyed out.",
  TYPE_HELP:
    "Filter between the main types of content in the edition: letters and the introductory texts.",
  DATE_HELP:
    "Filter by the date when a letter was written. For those letters for which the precise date of writing is unknown, they are included in the search results when they might have been written in the selected period. The display of the date (day-month or month-day) is determined by your computer or browser settings).",
  PERSONS_HELP:
    "Filter by individual(s) mentioned in the letters, the editorial notes, and the introduction. Use the search field at the top of the facet to find a specific person by name. Selecting a name will show only the document(s) in which this person is referenced. You can select multiple names at once; this will return documents where one of the selected persons is mentioned. Uncheck a name to remove it from your selection.",
  LOCATION_HELP:
    "Filter by the geographical place from which a letter was sent. You can begin typing in the search box at the top of the facet to narrow down the list of available locations. Select one or more places to view only the documents sent from those locations.",
  ARTWORKS_NL_HELP:
    "Filter by artworks referenced in the edition. Useful for tracking discussions of specific works. Some artworks are identified only by title, while others also include a catalogue number (e.g., artworks by Van Gogh). The presence or absence of a catalogue number reflects the available documentation and may vary. This facet also includes non-artwork illustrations (e.g., documentary photographs) mentioned or shown in the edition. You can use the search box at the top of the facet to find specific titles.",
  ARTWORKS_EN_HELP:
    "Filter by artworks referenced in the edition. Useful for tracking discussions of specific works. Some artworks are identified only by title, while others also include a catalogue number (e.g., artworks by Van Gogh). The presence or absence of a catalogue number reflects the available documentation and may vary. This facet also includes non-artwork illustrations (e.g., documentary photographs) mentioned or shown in the edition. You can use the search box at the top of the facet to find specific titles.",
  FILE_HELP:
    "Jump directly to a specific document, or select multiple documents.",
  SORT_BY_HELP:
    "Sort the list of documents by letter number or date in ascending or descending order. You can also sort by (system determined) relevance. The relevance is determined on the basis of (among others) the number of hits in the document.",
  FULL_TEXT_SEARCH_HELP:
    "Enter one or more keywords to search the content of the edition. Results include the original text, translation, and editorial notes. Consult the full help text for information on how to combine search terms, how to use wild cards, etc.",
  SHOW_CONTEXT_HELP:
    "Allows you to set the length of the text snippet around each keyword hit in the search results, helping you judge relevance before opening a document.",
  FILTER_FACETS_HELP:
    "Use facets (e.g., Persons, Location) to narrow down your results. Multiple facets and values can be combined.",
  SEARCH_HISTORY_HELP:
    "Shows the last ten searches executed on this browser. Clicking a search re-executes it. It is also possible to remove a previous search from the history.",
});
