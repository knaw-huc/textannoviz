import { englishLabels } from "../../default/config/englishLabels";

export const englishSurianoLabels = Object.assign({}, englishLabels, {
  //Text panel titles
  self: "Debug text",
  text: "Main text",
  appendix: "Appendix",
  original: "Main text + appendix",
  secretarial: "Secretarial",
  notes: "Notes",

  // search facet titles:
  bodyType: "Document type",
  "tf:File": "Letter",
  senderLoc: "Location of sender",
  sender: "Sender",
  recipient: "Recipient",
  recipientLoc: "Location of recipient",

  //Metadata panel
  summary: "Summary",
  shelfmark: "Shelfmark",

  COM: "commission",
  HOE: "role",
  LOC: "location",
  ORG: "organisation",
  PER: "person",

  "PRIMARY NAME": "Primary name",
  "OCCUPATIONS, ROLES, and/or TITLES": "Occupations, roles, titles",
  "BIRTH YEAR": "Date of birth",
  "DEATH YEAR": "Date of death",
});
