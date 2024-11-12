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
    "-maak gebruik van wildcards (‘*’ voor meer, ‘?’ voor één karakter) om varianten te vinden.\n" +
    "-plaats ‘~1’ of een groter getal achter de term als het resultaat 1 of meer karakters mag afwijken.",
  SEARCH_HISTORY_HELP: "Geeft een overzicht van de zoekacties in deze sessie.",
  SHOW_CONTEXT_HELP: "",
  SLIDER_FACET_HELP: "",
  FILTER_FACETS_HELP: "",
});
