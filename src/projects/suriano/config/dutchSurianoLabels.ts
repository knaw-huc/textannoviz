import { dutchLabels } from "../../default/config/dutchLabels";

export const dutchSurianoLabels = Object.assign({}, dutchLabels, {
  //Text panel titles
  self: "Debug tekst",
  text: "Hoofdtekst",
  appendix: "Appendix",
  original: "Hoofdtekst + appendix",
  secretarial: "Secretarieel",
  notes: "Notities",

  // search facet titles:
  bodyType: "Document type",
  "tf:File": "Letter",
  senderLoc: "Locatie van zender",
  sender: "Zender",
  recipient: "Ontvanger",
  recipientLoc: "Locatie van ontvanger",

  //Metadata panel
  summary: "Samenvatting",
  shelfmark: "Archiefreferentie",
});
