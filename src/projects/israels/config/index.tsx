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
import { MetadataPanel } from "../MetadataPanel";
import { SearchInfoPage } from "../SearchInfoPage";
import { PanelTemplates } from "../../../components/Detail/PanelTemplates";
import { TextPanels } from "../TextPanels";
import { EntitySummary } from "../annotation/EntitySummary";

export const israelsConfig: ProjectConfig = merge(
  {},
  kunstenaarsbrievenConfig,
  {
    id: "israels",
    broccoliUrl: "http://localhost:8082",
    siteTitle: "Isaac Israëls - Jo van Gogh-Bonger",

    elasticIndexName: "israels",
    initialDateFrom: "1891-01-01",
    initialDateTo: "1924-12-31",
    headerColor: "bg-[#dddddd] text-black border-b border-neutral-400",
    headerTitle: "Brieven van Isaac Israëls",
    personsUrl:
      "http://localhost:8040/files/israels/apparatus/bio-entities.json",
    artworksUrl:
      "http://localhost:8040/files/israels/apparatus/artwork-entities.json",
    biblUrl: {
      en: "http://localhost:8040/files/israels/apparatus/bibliolist-en.html",
      nl: "http://localhost:8040/files/israels/apparatus/bibliolist-nl.html",
    },
    components: {
      Header,
      SearchItem,
      Help,
      // MetadataPanel is too project-specific to make generic
      MetadataPanel,
      // SearchInfoPage is too project-specific to make generic
      SearchInfoPage,
      EntitySummary,
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
    detailPanels: [
      {
        name: "facs",
        visible: true,
        disabled: false,
        region: "left",
        size: "minmax(300px, 650fr)",
        panel: PanelTemplates.facsPanel,
      },
      {
        name: "text.orig",
        visible: true,
        disabled: false,
        region: "main",
        size: "minmax(300px, 750fr)",
        panel: TextPanels.origTextPanel,
      },
      {
        name: "text.trans",
        visible: true,
        disabled: false,
        region: "main",
        size: "minmax(300px, 750fr)",
        panel: TextPanels.transTextPanel,
      },
      {
        name: "metadata",
        visible: true,
        disabled: false,
        region: "right",
        size: "minmax(300px, 400fr)",
        panel: PanelTemplates.metadataPanel,
      },
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
    viewsToSearchIn: [
      "letterOriginalText",
      "letterTranslatedText",
      "letterNotesText",
      "introOriginalText",
      "introTranslatedText",
      "introNotesText",
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
    showFacsimilePrevNextScanButtonsButtons: true,
    showSearchInTextViews: true,
    zoomToAnnoOnFacsimile: true,
  } as ProjectSpecificConfig,
);
