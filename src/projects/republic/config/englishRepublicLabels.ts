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

  // search results:
  results: "resolutions",

  // text panel titles:
  self: "Text",

  COM: "commission",
  HOE: "role",
  LOC: "location",
  ORG: "organisation",
  PER: "person",

  ENTITIES: "Entities",
});
