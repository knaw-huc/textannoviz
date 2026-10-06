import mergeWith from "lodash/mergeWith";
import {
  ProjectConfig,
  ProjectSpecificConfig,
} from "../../../model/ProjectConfig";
import { englishMondrianLabels } from "./englishMondrianLabels";
// import { dutchVanGoghLabels } from "./dutchVanGoghLabels";
import { kunstenaarsbrievenConfig } from "../../kunstenaarsbrieven/config";
import { Persons } from "../Persons";
import { Bibliography } from "../Bibliography";
import { Header } from "../Header";
import { SearchItem } from "../SearchItem";
import { MetadataPanel } from "../MetadataPanel";
import { SearchInfoPage } from "../SearchInfoPage";
import { TextPanels } from "../TextPanels";
import { PanelTemplates } from "../../../components/Detail/PanelTemplates";
import { EntitySummaryDetails } from "../annotation/EntitySummaryDetails";
import { replaceArrays } from "../../default/config/replaceArrays";
import { getViteEnvVars } from "../../../utils/viteEnvVars";
import { buildNavLink } from "../utils/buildNavLink";
import { Artworks } from "../Artworks";

const { broccoliPortMondrian, nginxPortMondrian } = getViteEnvVars();

export const mondrianConfig: ProjectConfig = mergeWith(
  {},
  kunstenaarsbrievenConfig,
  {
    id: "mondrian",
    broccoliUrl: `http://localhost:${broccoliPortMondrian ?? "8082"}`,
    siteTitle: "The letters of Piet Mondriaan",

    elasticIndexName: "mondrian",
    initialDateFrom: "1500-01-01",
    initialDateTo: "2026-12-31",
    headerColor: "bg-[#dddddd] text-black border-b border-neutral-400",
    headerTitle: "Brieven van Van Gogh",
    personsUrl: `http://localhost:${
      nginxPortMondrian ?? "8040"
    }/files/mondrian/apparatus/bio-entities.json`,
    artworksUrl: [
      {
        key: "all",
        url: `http://localhost:${
          nginxPortMondrian ?? "8040"
        }/files/mondrian/apparatus/artwork-entities.json`,
      },
    ],
    biblUrl: {
      en: `http://localhost:${
        nginxPortMondrian ?? "8040"
      }/files/mondrian/apparatus/biblio.html`,
    },
    menuUrl: `http://localhost:${
      nginxPortMondrian ?? "8040"
    }/files/mondrian/menu/menu.json`,
    letterIdUrl: `http://localhost:${
      nginxPortMondrian ?? "8040"
    }/files/mondrian/letter-ids.json`,
    components: {
      Header,
      SearchItem,
      // MetadataPanel is too project-specific to make generic
      MetadataPanel,
      // SearchInfoPage is too project-specific to make generic
      SearchInfoPage,
      EntitySummaryDetails,
    },
    defaultKeywordAggsToRender: [
      "type",
      "location",
      // "file",
      "persons",
      // "artworksNL",
      "artworksEN",
      "recipient",
      "sender",
      "correspondent",
      "institution",
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
    entityMatchLocations: [
      { name: "text.orig", view: ["text.nl", "text.fr", "text.en"] },
      { name: "text.trans", view: "text.en" },
    ],
    overrideDefaultAggs: [
      {
        facetName: "persons",
        order: "keyAsc",
        size: 9999,
      },
      {
        facetName: "artworksNL",
        size: 9999,
      },
      {
        facetName: "artworksEN",
        size: 9999,
      },
      {
        facetName: "file",
        order: "keyAsc",
        size: 9999,
      },
    ],
    viewsToSearchIn: [
      "letterOriginalText",
      "letterTranslatedText",
      "letterNotesText",
      "introText",
      // "introTranslatedText",
      // "introNotesText",
    ],
    selectedLanguage: "en",
    languages: [{ code: "en", labels: englishMondrianLabels }],
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
    zoomToAnnoOnFacsimile: true,
    // TODO: how to test this?
    showAnnosOnFacsimile: true,
    showFacsimilePrevNextScanButtonsButtons: true,
    buildNavLink: buildNavLink,
  } as ProjectSpecificConfig,
  replaceArrays,
);
