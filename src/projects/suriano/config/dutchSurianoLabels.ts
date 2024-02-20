import { dutchLabels } from "../../default/config/dutchLabels";

export const dutchSurianoLabels = Object.assign({}, dutchLabels, {
  self: "Tekst",

  // search facet titles:
  bodyType: "Document",
  "tf:File": "Letter",
  senderLoc: "Locatie van zender",
  sender: "Zender",
  recipient: "Ontvanger",
  recipientLoc: "Locatie van ontvanger",
});
