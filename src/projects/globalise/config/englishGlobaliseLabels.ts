import { englishLabels } from "../../default/config/englishLabels.ts";

export const englishGlobaliseLabels = Object.assign({}, englishLabels, {
  // search facet titles:
  bodyType: "Body type",
  className: "Class name",
  classDescription: "Class description",
  INPUT_FACET_LABEL: "Filter by inv. nr.",
  INPUT_FACET_PLACEHOLDER: "Press ENTER to filter by inv. nr.",
  invNr: "inv. nr.",
  INPUT_FACET_EMPTY_WARNING:
    "No inv. nr. was specified. Please specify an inv. nr.",

  // text panel titles:
  self: "Full text",
});
