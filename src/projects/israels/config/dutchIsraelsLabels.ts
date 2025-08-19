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

  //Footer
  NAVIGATE_SEARCH_RESULTS: "Navigeer zoekresultaten",

  //Search item
  letterOriginalText: "Geëditeerde tekst (brief)",
  letterTranslatedText: "Vertaling (brief)",
  letterNotesText: "Annotaties (brief)",
  introOriginalText: "Tekst (over deze editie)",
  introTranslatedText: "Vertaling (over deze editie)",
  introNotesText: "Annotaties (over deze editie)",
  UNKNOWN: "Onbekend document type",
  to: "aan",
  intro: "Over deze editie",
  LET_NUM: "Briefnummer",

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
  INFO_TITLE: "De brieven van Isaac Israëls aan Jo van Gogh-Bonger",
  EDITED_BY: "Bezorgd door Hans Luijten",
  P1: "Deze editie bevat de ruim honderd brieven van de kunstenaar Isaac Israëls (1865-1934) aan Jo van Gogh-Bonger (1862-1925). Jo was getrouwd met Vincent van Goghs broer Theo en zij zorgde na hun overlijden voor de nalatenschap van de broers.",
  P2: "Israëls schrijft openhartig en vol verve over kunst, literatuur, muziek, liefde en vriendschap. Hij had grote belangstelling voor Jo en haar wederwaardigheden, en genoot van hun samenzijn. Maar hij was ook geïnteresseerd in het werk van Vincent en daar geeft hij herhaaldelijk blijk van.",
  SCROLL_TO_LETTERS: "Ontdek de brieven",

  //Help labels
  SEARCH_IN_HELP:
    "Gebruik deze knop om uw zoekopdracht te beperken tot specifieke delen van de editie: de originele teksten, vertalingen of redactionele aantekeningen in de brieven of de inleidende teksten.",
  LANG_MENU_HELP:
    "Schakel tussen Nederlands en Engels. Dit geldt zowel voor de interface als voor de inhoud van de editie.",
  VIEW_HELP:
    "Gebruik de weergaveopties rechtsonder in het venster om elementen zoals transcriptie, vertaling, metadata of facsimile weer te geven of te verbergen. Verborgen elementen worden grijs weergegeven.",
  TYPE_HELP:
    "Filter op de belangrijkste inhoudstypen in de editie: brieven en inleidende teksten.",
  DATE_HELP:
    "Filter op de datum waarop een brief is geschreven. Brieven waarvan de precieze datum onbekend is, worden in de zoekresultaten opgenomen wanneer ze in de geselecteerde periode kunen zijn geschreven. De weergave van de datum (dag-maand of maand-dag) wordt bepaald door de instellingen van uw computer of browser.",
  PERSONS_HELP:
    "Filter op personen die worden genoemd in de brieven, de redactionele aantekeningen en de inleiding. Gebruik het zoekveld bovenaan het facet om een specifieke persoon op naam te zoeken. Als u een naam selecteert, worden alleen de documenten weergegeven waarin deze persoon wordt genoemd. U kunt meerdere namen tegelijk selecteren; dan worden documenten weergegeven waarin één van de geselecteerde personen wordt genoemd. Schakel een naam uit om deze uit uw selectie te verwijderen.",
  LOCATION_HELP:
    "Filter op de geografische plaats van waaruit een brief is verzonden. U kunt beginnen met typen in het zoekvak bovenaan het facet om de lijst met beschikbare locaties te verfijnen. Selecteer één of meer plaatsen om alleen de documenten te bekijken die vanaf die locaties zijn verzonden.",
  ARTWORKS_NL_HELP:
    "Filter op kunstwerken waarnaar in de editie wordt verwezen. Handig voor het bestuderen van discussies over specifieke werken. Sommige kunstwerken worden alleen met de titel aangeduid, terwijl andere ook een catalogusnummer hebben (bijvoorbeeld kunstwerken van Van Gogh). Het al dan niet aanwezig zijn van een catalogusnummer hangt af van de beschikbare documentatie en kan variëren. Dit facet omvat ook illustraties die geen kunstwerken zijn (bijvoorbeeld documentaire foto's) die in de editie worden genoemd of getoond. U kunt het zoekvak bovenaan het facet gebruiken om specifieke titels te vinden.",
  ARTWORKS_EN_HELP:
    "Filter op kunstwerken waarnaar in de editie wordt verwezen. Handig voor het bestuderen van discussies over specifieke werken. Sommige kunstwerken worden alleen met de titel aangeduid, terwijl andere ook een catalogusnummer hebben (bijvoorbeeld kunstwerken van Van Gogh). Het al dan niet aanwezig zijn van een catalogusnummer hangt af van de beschikbare documentatie en kan variëren. Dit facet omvat ook illustraties die geen kunstwerken zijn (bijvoorbeeld documentaire foto's) die in de editie worden genoemd of getoond. U kunt het zoekvak bovenaan het facet gebruiken om specifieke titels te vinden.",
  FILE_HELP:
    "Ga direct naar een specifiek document of selecteer meerdere documenten.",
  SORT_BY_HELP:
    "Sorteer de lijst met documenten op briefnummer of datum in oplopende of aflopende volgorde. U kunt ook sorteren op (door het systeem bepaalde) relevantie. De relevantie wordt onder andere bepaald op basis van het aantal treffers in het document.",
  FULL_TEXT_SEARCH_HELP:
    "Voer een of meer trefwoorden in om de inhoud van de editie te doorzoeken. De resultaten bevatten treffers uit de originele tekst, vertaling en redactionele aantekeningen. Raadpleeg de volledige helptekst voor informatie over het combineren van zoektermen, het gebruik van jokertekens, enz.",
  SHOW_CONTEXT_HELP:
    "Hiermee kunt u de lengte van het tekstfragment rond de treffers in de zoekresultaten instellen, zodat u de relevantie kunt beoordelen voordat u een document opent.",
  FILTER_FACETS_HELP:
    "Gebruik facetten (bijv. personen, locatie) om uw resultaten te verfijnen. Meerdere facetten en waarden kunnen worden gecombineerd.",
});
