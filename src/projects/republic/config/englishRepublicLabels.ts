import { englishLabels } from "../../default/config/englishLabels.ts";

export const englishRepublicLabels = Object.assign({}, englishLabels, {
  // facet translations:
  maandag: "Monday",
  dinsdag: "Tuesday",
  woensdag: "Wednesday",
  donderdag: "Thursday",
  vrijdag: "Friday",
  zaterdag: "Saturday",
  zondag: "Sunday",
  Resolution: "Resolution",
  AttendanceList: "Attendance list",

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
  sessionWeekday: "Weekday",
  bodyType: "Type",
  propositionType: "Proposition type",
  sliderFacetLabel: "Min/max number of words",
  resolutionType: "Resolution type",
  textType: "Text type",
  facetInputFilterPlaceholder: "Search in facet",

  attendantId: "Delegate (ID)",
  attendantName: "Delegate (entity)",
  commissionId: "Commission (ID)",
  commissionName: "Commission (entity)",
  commissionCategories: "Commission (category)",
  delegateName: "Delegate (entity)",
  delegateId: "Delegate (ID)",
  delegateProvince: "Delegate (province)",
  delegateIsPresident: "Delegate (president)",
  locationId: "Location (ID)",
  locationName: "Location (entity)",
  locationCategories: "Location (category)",
  organisationId: "Organisation (ID)",
  organisationName: "Organisation (entity)",
  organisationCategories: "Organisation (category)",
  personId: "Person name (ID)",
  personName: "Person name (entity)",
  personCategories: "Person name (category)",
  roleId: "Capacity (ID)",
  roleName: "Capacity (name)",
  roleCategories: "Capacity (category)",

  // search results:
  results: "resolutions",

  //Metadata panel:
  category: "Category",
  date: "Date",
  delegates: "Delegates",
  DELEGATE_LINK: "Link to entity browser",
  name: "Name",
  NO_DATA: "No data available",
  president: "President",

  // text panel titles:
  self: "Text",

  COM: "commission",
  DAT: "date",
  HOE: "role",
  LOC: "location",
  ORG: "organisation",
  PER: "person",

  page: "Page",

  ENTITIES: "Entities",

  //Footer
  prevResolution: "Previous resolution",
  nextResolution: "Next resolution",

  FULL_TEXT_SEARCH_HELP:
    "Search for terms or names that appear in the resolutions \n" +
    "- Use wildcards ('*' for multiple characters, '?' for single characters) to find variations.\n" +
    "- Add '~1' or '~2' after the term if the result may differ by 1 or 2 characters.\n" +
    "- Use Boolean operators for terms that must appear together in a single resolution (OR (default), AND, NOT).\n" +
    "- Enclose multiple terms that must appear next to each other between double quotation marks.",
  SEARCH_HISTORY_HELP: "Provides an overview of your last ten search queries.",
  SHOW_CONTEXT_HELP:
    "Optionally shows more or less surrounding text for a search term in a resolution.",
  SLIDER_FACET_HELP:
    "Filter by resolutions that contain a certain number of words.",
  FILTER_FACETS_HELP: "This allows you to show or hide filters.",

  COMMISSION_ID_HELP:
    "Filter by identification number of a commission from the States General.",
  COMMISSION_NAME_HELP:
    "Filter by name of a commission from the States General.",
  COMMISSION_CATEGORIES_HELP:
    "Filter by category of the commissions from the States General.",
  DELEGATE_ID_HELP: "Filter by identification number of present deputies.",
  DELEGATE_NAME_HELP: "Filter by surname of present deputies.",
  LOCATION_ID_HELP: "Filter by identification number of a location.",
  LOCATION_NAME_HELP: "Filter by location name.",
  LOCATION_CATEGORIES_HELP: "Filter by location category.",
  ORGANISATION_ID_HELP: "Filter by identification number of an organisation.",
  ORGANISATION_NAME_HELP: "Filter by organisation name.",
  ORGANISATION_CATEGORIES_HELP: "Filter by category of organisations.",
  PERSON_ID_HELP: "Filter by identification number of a person's name.",
  PERSON_NAME_HELP: "Filter by a person's surname.",
  ROLE_ID_HELP:
    "Filter by capacity identification number. Capacities are the roles or functions in which individuals appear in the resolutions.",
  ROLE_NAME_HELP:
    "Filter by name of a capacity. Capacities are the roles or functions in which individuals appear in the resolutions.",
  ROLE_CATEGORIES_HELP:
    "Filter by category of the capacities. Capacities are the roles or functions in which individuals appear in the resolutions.",
  // BODY_TYPE_HELP: "",
  PROPOSITION_TYPE_HELP:
    "The 'proposition' was the proposal that led to a decision (resolution), usually submitted in writing (letter, petition, etc.), but sometimes orally.",
  RESOLUTION_TYPE_HELP:
    "The dataset includes ordinary (ordinaris), secret (secreet) and special resolutions (on special subjects).",
  TEXT_TYPE_HELP:
    "The dataset includes handwritten ordinary (1576-1702), secret (1576-1796) and special resolutions (1576-1796), as well as printed ordinary resolutions (1703-1796).",
  SESSION_WEEKDAY_HELP:
    "Filter by day of the week on which resolutions were made.",
  SORT_BY_HELP: "Customise the sort order of the results.",
  ATTENDANTS_LIST_HELP:
    "Shows the deputies who attended this meeting (clickable).",
  TOGGLE_INFO_HELP: "Hide or show the right panel.",

  FILTER_FACETS: "Set filters",

  NEXT: "Next result",
  PREV: "Previous result",
  BACK_TO_SEARCH: "Back to results",

  OCCURRENCES_PER_YEAR: "Resolutions by year",

  PROVENANCE: "View provenance",
});
