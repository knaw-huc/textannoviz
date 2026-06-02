import merge from "lodash/merge";
import {
  ProjectConfig,
  ProjectSpecificConfig,
} from "../../../model/ProjectConfig";
import { englishNvvLabels } from "./englishNvvLabels";
// import { dutchVanGoghLabels } from "./dutchVanGoghLabels";
import { kunstenaarsbrievenConfig } from "../../kunstenaarsbrieven/config";
import { Header } from "../Header";
import { SearchItem } from "../SearchItem";
import { MetadataPanel } from "../MetadataPanel";
import { SearchInfoPage } from "../SearchInfoPage";
import { TextPanels } from "../TextPanels";
import { PanelTemplates } from "../../../components/Detail/PanelTemplates";

export const nvvConfig: ProjectConfig = merge({}, kunstenaarsbrievenConfig, {
  id: "nvv",
  broccoliUrl: "http://localhost:8082",
  siteTitle: "Van Gogh Letters",

  elasticIndexName: "nvv",
  initialDateFrom: "1500-01-01",
  initialDateTo: "2026-12-31",
  headerColor: "bg-[#dddddd] text-black border-b border-neutral-400",
  headerTitle: "Brieven van Van Gogh",
  components: {
    Header,
    SearchItem,
    // MetadataPanel is too project-specific to make generic
    MetadataPanel,
    // SearchInfoPage is too project-specific to make generic
    SearchInfoPage,
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
    { code: "en", labels: englishNvvLabels },
  ],
  zoomToAnnoOnFacsimile: true,
  // TODO: how to test this?
  showAnnosOnFacsimile: true,
  showFacsimilePrevNextScanButtonsButtons: true,
} as ProjectSpecificConfig);
