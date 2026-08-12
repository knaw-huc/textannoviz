import mergeWith from "lodash/mergeWith";
import {
  ProjectConfig,
  ProjectSpecificConfig,
} from "../../../model/ProjectConfig";
import { englishMechteldVanGelreLabels } from "./englishMechteldVanGelreLabels";
// import { dutchVanGoghLabels } from "./dutchVanGoghLabels";
import { kunstenaarsbrievenConfig } from "../../kunstenaarsbrieven/config";
import { Persons } from "../Persons";
// import { Artworks } from "../artworks/Artworks";
import { Bibliography } from "../Bibliography";
import { Header } from "../Header";
import { SearchItem } from "../SearchItem";
import { MetadataPanel } from "../MetadataPanel";
import { SearchInfoPage } from "../SearchInfoPage";
import { TextPanels } from "../TextPanels";
import { PanelTemplates } from "../../../components/Detail/PanelTemplates";
import { EntitySummaryDetails } from "../annotation/EntitySummaryDetails";
import { replaceArrays } from "../../default/config/replaceArrays";

export const mechteldvangelreConfig: ProjectConfig = mergeWith(
  {},
  kunstenaarsbrievenConfig,
  {
    id: "mechteldvangelre",
    broccoliUrl: "http://localhost:8082",
    siteTitle: "Mechteld van Gelre Letters",

    elasticIndexName: "mechteldvangelre",
    initialDateFrom: "1300-01-01",
    initialDateTo: "1500-12-31",
    headerColor: "bg-[#dddddd] text-black border-b border-neutral-400",
    headerTitle: "Mechteld van Gelre Letters",
    personsUrl:
      "http://localhost:8040/files/mechteldvangelre/apparatus/bio-entities.json",
    biblUrl: {
      en: "http://localhost:8040/files/mechteldvangelre/apparatus/bibliolist.html",
    },
    // menuUrl: `http://localhost:${
    //   nginxPortVangogh ?? "8040"
    // }/files/vangogh/menu/menu.json`,
    letterIdUrl: "http://localhost:8040/files/mechteldvangelre/letter-ids.json",
    // homeUrl: `http://localhost:${
    //   nginxPortVangogh ?? "8040"
    // }/files/vangogh/home/home.html`,
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
      "period",
      "file",
      "persons",
      // "artworksNL",
      "artworksEN",
      "recipient",
      "sender",
      "correspondent",
      "bibleRefs",
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
      {
        facetName: "period",
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
    languages: [
      // { code: "nl", labels: dutchVangoghLabels },
      { code: "en", labels: englishMechteldVanGelreLabels },
    ],
    routes: [
      {
        path: "persons",
        element: <Persons />,
      },
      // {
      //   path: "artworks",
      //   element: <Artworks />,
      // },
      {
        path: "bibliography",
        element: <Bibliography />,
      },
    ],
    zoomToAnnoOnFacsimile: true,
    // TODO: how to test this?
    showAnnosOnFacsimile: true,
    showFacsimilePrevNextScanButtonsButtons: true,
  } as ProjectSpecificConfig,
  replaceArrays,
);
