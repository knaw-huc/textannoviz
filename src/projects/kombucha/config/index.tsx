import mergeWith from "lodash/mergeWith";
import {
  ProjectConfig,
  ProjectSpecificConfig,
} from "../../../model/ProjectConfig";
import { englishVanGoghLabels } from "./englishVanGoghLabels";
// import { dutchVanGoghLabels } from "./dutchVanGoghLabels";
import { kunstenaarsbrievenConfig } from "../../kunstenaarsbrieven/config";
import { Persons } from "../Persons";
import { Artworks } from "../artworks/Artworks";
import { Bibliography } from "../Bibliography";
import { Header } from "../Header";
import { SearchItem } from "../SearchItem";
import { MetadataPanel } from "../MetadataPanel";
import { SearchInfoPage } from "../SearchInfoPage";
import { TextPanels } from "../TextPanels";
import { PanelTemplates } from "../../../components/Detail/PanelTemplates";
import { EntitySummaryDetails } from "../annotation/EntitySummaryDetails";
import { replaceArrays } from "../../default/config/replaceArrays";
import vangoghFavicon from "../../../assets/vangogh-favicon.ico";
import { getNotesTexts } from "../../kunstenaarsbrieven/text/getNotesTexts";
import { createGetMetadataTexts } from "../../kunstenaarsbrieven/text/getMetadataTexts";
import { getVangoghEntityFacetValues } from "../../vangogh/annotation/getVangoghEntityFacetValues";
import { buildNavLink } from "../utils/buildNavLink";

export const kombuchaConfig: ProjectConfig = mergeWith(
  {},
  kunstenaarsbrievenConfig,
  {
    id: "kombucha",
    broccoliUrl: "http://localhost:8040",
    siteTitle: "Combined Edition",

    elasticIndexName: "kombucha",
    initialDateFrom: "1500-01-01",
    initialDateTo: "2026-12-31",
    headerColor: "bg-[#dddddd] text-black border-b border-neutral-400",
    headerTitle: "Brieven van Van Gogh",
    favicon: vangoghFavicon,
    components: {
      Header,
      SearchItem,
      // MetadataPanel is too project-specific to make generic
      MetadataPanel,
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
      "worksMentioned",
      "journals",
      "corpus",
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
      {
        facetName: "worksMentioned",
        size: 999,
      },
      {
        facetName: "journals",
        size: 999,
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
    allPossibleTextPanels: [
      "text",
      "textNotes",
      "transcrSource",
      "dating",
      "remarks",
      "ogtNotes",
    ],
    selectedLanguage: "en",
    languages: [
      // { code: "nl", labels: dutchVangoghLabels },
      { code: "en", labels: englishVanGoghLabels },
    ],
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
    // Lists the matches, so only where searchHitLocations is set
    showHighlightsTab: true,
    searchHitLocations: [
      { name: "text.orig", view: ["text.nl", "text.fr", "text.en"] },
      { name: "text.trans", view: "text.en" },
      { name: "notes", kind: "tab", panel: "metadata", view: getNotesTexts },
      {
        name: "metadata",
        kind: "tab",
        panel: "metadata",
        // In the order MetadataPanel renders them
        view: createGetMetadataTexts(["dating", "transcrSource", "remarks"]),
      },
    ],
    getEntityFacetValues: getVangoghEntityFacetValues,
    buildNavLink: buildNavLink,
  } as ProjectSpecificConfig,
  replaceArrays,
);
