import merge from "lodash/merge";
import {
  ProjectConfig,
  ProjectSpecificConfig,
} from "../../../model/ProjectConfig";
import projectCss from "../project.css?inline";
import { englishIsraelsLabels } from "./englishIsraelsLabels";
import { dutchIsraelsLabels } from "./dutchIsraelsLabels";
import { kunstenaarsbrievenConfig } from "../../kunstenaarsbrieven/config";
import { Bibliography } from "../Bibliography";
import { Artworks } from "../Artworks";
import { Persons } from "../Persons";
import { Header } from "../Header";
import { SearchItem } from "../SearchItem";
import { Help } from "../Help";

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
    components: {
      Header,
      SearchItem,
      Help,
    },
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
    routes: [
      {
        path: "persons",
        element: <Persons />,
      },
      {
        path: "artworks",
        element: <Artworks />,
      },
      {
        path: "bibliography",
        element: <Bibliography />,
      },
    ],
  } as ProjectSpecificConfig,
);
