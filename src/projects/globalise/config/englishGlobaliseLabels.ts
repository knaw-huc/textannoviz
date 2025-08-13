import { englishLabels } from "../../default/config/englishLabels.ts";

export const englishGlobaliseLabels = Object.assign({}, englishLabels, {
  // search facet titles:
  bodyType: "Body type",
  className: "Class name",
  classDescription: "Class description",
  INPUT_FACET_LABEL: "+ filter by inventory nr.",
  INPUT_FACET_PLACEHOLDER: "Press ENTER to filter by inv. nr.",
  invNr: "inv. nr.",
  INPUT_FACET_EMPTY_WARNING:
    "No inventory no. was specified. Please specify an inventory number(s).",
  langLabel: "Language (label)",

  // text panel titles:
  self: "Full text",

  // search results:
  results: "pages",
});
