import { dutchLabels } from "../../default/config/dutchLabels";

export const dutchIsraelsLabels = Object.assign({}, dutchLabels, {
  //Search facet titles + metadata panel titles
  institution: "Collectie-houdende instelling",
  period: "Periode",
  msid: "Signatuur",
  location: "Locatie",
  correspondent: "Correspondent",
  file: "Briefnummer",
  letterid: "Briefnummer",
  periodlong: "Periode (lang)",
  type: "Type",

  facetInputFilterPlaceholder: "Zoek in facet",

  //Text panel titles
  self: "Brief",
  "text.nl": "Originele tekst",
  "text.en": "Vertaalde tekst",

  //panels
  facs: "Facsimile",
  metadata: "Info",

  //Search item
  letterOriginalText: "Geëditeerde tekst (brief)",
  letterTranslatedText: "Vertaling (brief)",
  letterNotesText: "Redactionele noten (brief)",
  introOriginalText: "Tekst (inleiding)",
  introTranslatedText: "Vertaling (inleiding)",
  introNotesText: "Redactionele noten (inleiding)",
  UNKNOWN: "Onbekend document type",
  to: "aan",
  intro: "Over deze editie",

  //Metadata panel
  NO_NOTES: "Deze brief bevat geen noten.",
  letter: "Brief",
  invNr: "Signatuur",
  addInfo: "Aanvullende informatie",
  NO_DATA: "Geen metadata",

  //Metadata panel titles
  notes: "Noten",

  //Visualised annotation categories
  PER: "persoon",
  ART: "kunstwerk",
  REF: "referentie",

  //Header
  persons: "Personen",
  artworks: "Kunstwerken",
  introHeader: "Over deze editie",
  bibliography: "Bibliografie",

  //Entity summary
  NAV_TO_LETTER: "Navigeer naar brief",

  //Entity labels
  artist: "Kunstenaar",
  date: "Datering",
  size: "Afmetingen",
  support: "Medium",
  collection: "Collectie",
  credits: "Verantwoording",

  //Search info page
  SCROLL_TO_LETTERS: "Ontdek de brieven",
});
