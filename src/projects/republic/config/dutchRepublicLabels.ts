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

  attendantId: "Gedeputeerde (ID)",
  attendantName: "Gedeputeerde (entiteit)",
  commissionId: "Commissie (ID)",
  commissionName: "Commissie (entiteit)",
  commissionLabels: "Commissie (categorie)",
  locationId: "Locatie (ID)",
  locationName: "Locatie (entiteit)",
  locationLabels: "Locatie (categorie)",
  organisationId: "Organisatie (ID)",
  organisationName: "Organisatie (entiteit)",
  organisationLabels: "Organisatie (categorie)",
  personId: "Persoonsnaam (ID)",
  personName: "Persoonsnaam (entiteit)",
  personLabels: "Persoonsnaam (categorie)",
  roleId: "Hoedanigheid (ID)",
  roleName: "Hoedanigheid (entiteit)",
  roleLabels: "Hoedanigheid (categorie)",

  // search results:
  results: "resoluties",

  //Metadata panel:
  name: "Entiteit",
  category: "Categorie",
  delegates: "Gedeputeerden",

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
  FILTER_FACETS_HELP: "Hiermee kunt u facetten tonen of verbergen.",
  ATTENDANT_ID_HELP: "Filter op identificatienummer aanwezige gedeputeerden.",
  ATTENDANT_NAME_HELP: "Filter op achternaam van aanwezige gedeputeerden.",
  COMMISSION_ID_HELP:
    "Filter op identificatienummer van een commissie uit de Staten-Generaal.",
  COMMISSION_NAME_HELP:
    "Filter op naam van een commissie uit de Staten-Generaal.",
  COMMISSION_LABELS_HELP:
    "Filter op categorie van de commissies uit de Staten-Generaal.",
  LOCATION_ID_HELP: "Filter op identificatienummer van een locatie.",
  LOCATION_NAME_HELP: "Filter op naam van een locatie.",
  LOCATION_LABELS_HELP: "Filter op categorie van de locaties.",
  ORGANISATION_ID_HELP: "Filter op identificatienummer van een organisatie.",
  ORGANISATION_NAME_HELP: "Filter op naam van een organisatie.",
  ORGANISATION_LABELS_HELP: "Filter op categorie van de organisaties.",
  PERSON_ID_HELP: "Filter op identificatienummer van een persoonsnaam.",
  PERSON_NAME_HELP: "Filter op achternaam van een persoon.",
  // PERSON_LABELS_HELP: "",
  ROLE_ID_HELP:
    "Filter op identificatienummer van een hoedanigheid. Hoedanigheden zijn de rollen of functies waarin personen in de resoluties voorkomen.",
  ROLE_NAME_HELP:
    "Filter op naam van een hoedanigheid. Hoedanigheden zijn de rollen of functies waarin personen in de resoluties voorkomen.",
  ROLE_LABELS_HELP:
    "Filter op categorie van de hoedanigheden. Hoedanigheden zijn de rollen of functies waarin personen in de resoluties voorkomen.",
  BODY_TYPE_HELP: "",
  PROPOSITION_TYPE_HELP:
    "De ‘propositie’ was het voorstel dat leidde tot een besluit (resolutie), meestal schriftelijk (missive, requeste etc.), maar soms mondeling ingediend.",
  RESOLUTION_TYPE_HELP:
    "Het bestand omvat gewone (ordinaris), geheime (secreet) en speciale resoluties (over bijzondere onderwerpen).",
  TEXT_TYPE_HELP:
    "Het bestand omvat handgeschreven ordinaris (1576-1702), secrete (1576-1796) en speciale resoluties (1576-1796), en gedrukte ordinaris resoluties (1703-1796).",
  SESSION_WEEKDAY_HELP:
    "Filter op dag van de week waarop resoluties werden genomen.",
  SORT_BY_HELP: "Pas de sorteervolgorde van de resultaten aan.",
  ATTENDANTS_LIST_HELP:
    "Toont de gedeputeerden die aanwezig waren bij deze vergadering (aanklikbaar).",
  TOGGLE_INFO_HELP: "Verberg of toon het rechterpaneel.",
});
