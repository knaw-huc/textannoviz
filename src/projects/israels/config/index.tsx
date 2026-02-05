import merge from "lodash/merge";
import {
  ProjectConfig,
  ProjectSpecificConfig,
} from "../../../model/ProjectConfig";
import projectCss from "../project.css?inline";
import { englishIsraelsLabels } from "./englishIsraelsLabels";
import { dutchIsraelsLabels } from "./dutchIsraelsLabels";
import { kunstenaarsbrievenConfig } from "../../kunstenaarsbrieven/config";
export const israelsConfig: ProjectConfig = merge(
  {},
  kunstenaarsbrievenConfig,
  {
    id: "israels",
    broccoliUrl: "http://localhost:8082",

    elasticIndexName: "israels",
    initialDateFrom: "1891-01-01",
    initialDateTo: "1924-12-31",
    headerColor: "bg-[#dddddd] text-black border-b border-neutral-400",
    headerTitle: "Brieven van Isaac Israëls",
    defaultKeywordAggsToRender: [
      "type",
      "location",
      "period",
      "file",
      "persons",
      // "artworksNL",
      "artworksEN",
    ],
    overrideDefaultAggs: [
      {
        facetName: "persons",
        order: "keyAsc",
        size: 200,
      },
      {
        facetName: "artworksNL",
        size: 200,
      },
      {
        facetName: "artworksEN",
        size: 200,
      },
      {
        facetName: "file",
        order: "keyAsc",
        size: 200,
      },
    ],
    selectedLanguage: "en",
    languages: [
      { code: "nl", labels: dutchIsraelsLabels },
      { code: "en", labels: englishIsraelsLabels },
    ],
    projectCss: projectCss,
  } as ProjectSpecificConfig,
);
