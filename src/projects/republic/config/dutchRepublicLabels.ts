import { dutchLabels } from "../../default/config/dutchLabels.ts";

export const dutchRepublicLabels = Object.assign({}, dutchLabels, {
  // facet translations:
  Resolution: "Resolutie",
  AttendanceList: "Presentielijst",

  // annotation type titles:
  Attendant: "Attendant",
  Line: "Line",
  Page: "Page",
  RepublicParagraph: "Paragraph",
  Reviewed: "Reviewed",
  Scan: "Scan",
  Session: "Session",
  TextRegion: "Text region",
  Volume: "Volume",

  // search facet titles:
  sessionDate: "Date",
  sessionWeekday: "Weekdag",
  bodyType: "Type",
  propositionType: "Propositietype",
  sliderFacetLabel: "Aantal woorden in resoluties",
  resolutionType: "Resolutietype",
  textType: "Teksttype",

  attendantId: "Attendants-ID",
  attendantName: "Attendantsnaam",
  commissionId: "Commissie-ID",
  commissionName: "Commissienaam",
  commissionLabels: "Commissielabel",
  locationId: "Locatie-ID",
  locationName: "Locatienaam",
  locationLabels: "Locatielabel",
  organisationId: "Organisatie-ID",
  organisationName: "Organisatienaam",
  organisationLabels: "Organisatielabel",
  personId: "Persoons-ID",
  personName: "Persoonsnaam",
  personLabels: "Persoonslabel",
  roleId: "Hoedanigheids-ID",
  roleName: "Hoedanigheidsnaam",
  roleLabels: "Hoedanigheidslabel",

  // search results:
  results: "resoluties",

  // text panel titles:
  self: "Tekst",

  COM: "commissie",
  DAT: "datum",
  HOE: "hoedanigheid",
  LOC: "locatie",
  ORG: "organisatie",
  PER: "persoon",

  page: "Pagina",

  ENTITIES: "Entiteiten",

  FULL_TEXT_SEARCH_HELP:
    "Zoek naar termen of namen die voorkomen in de resoluties. \n" +
    "- Maak gebruik van wildcards (‘*’ voor meer, ‘?’ voor één karakter) om varianten te vinden.\n" +
    "- Plaats ‘~1’ of een groter getal achter de term als het resultaat 1 of meer karakters mag afwijken. \n" +
    "- Gebruik Booleaanse operatoren voor termen die samen in één resolutie moeten voorkomen (OR (standaard), AND, NOT). \n" +
    "- Zet meerdere termen die naast elkaar moeten voorkomen tussen dubbele aanhalingstekens.",
  SEARCH_HISTORY_HELP: "Geeft een overzicht van de zoekacties in deze sessie.",
  SHOW_CONTEXT_HELP:
    "Toont naar keuze meer of minder omliggende tekst bij een zoekterm in een resolutie.",
  SLIDER_FACET_HELP: "Filter op resoluties van een bepaalde woordomvang.",
  // FILTER_FACETS_HELP: "",
  FILTER_FACETS_HELP: "Hiermee kunt u facetten tonen of verbergen.",
});
