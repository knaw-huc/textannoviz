import merge from "lodash/merge";
import {
  ProjectConfig,
  ProjectSpecificConfig,
} from "../../../model/ProjectConfig";
import projectCss from "../project.css?inline";
import { englishVangoghLabels } from "./englishVangoghLabels";
import { dutchVangoghLabels } from "./dutchVangoghLabels";
import { kunstenaarsbrievenConfig } from "../../kunstenaarsbrieven/config";
import { Persons } from "../Persons";
import { Artworks } from "../Artworks";
import { Bibliography } from "../Bibliography";
import { Header } from "../Header";
import { SearchItem } from "../SearchItem";
import { MetadataPanel } from "../MetadataPanel";
import { SearchInfoPage } from "../SearchInfoPage";
import { TextPanels } from "../TextPanels";
import { PanelTemplates } from "../../../components/Detail/PanelTemplates";
import { EntitySummary } from "../annotation/EntitySummary";

export const vangoghConfig: ProjectConfig = merge(
  {},
  kunstenaarsbrievenConfig,
  {
    id: "vangogh",
    broccoliUrl: "http://localhost:8082",

    elasticIndexName: "vangogh",
    initialDateFrom: "1872-01-01",
    initialDateTo: "1890-12-31",
    headerColor: "bg-[#dddddd] text-black border-b border-neutral-400",
    headerTitle: "Brieven van Van Gogh",
    components: {
      Header,
      SearchItem,
      // MetadataPanel is too project-specific to make generic
      MetadataPanel,
      // SearchInfoPage is too project-specific to make generic
      SearchInfoPage,
      EntitySummary,
    },
    defaultKeywordAggsToRender: [
      "type",
      // "location",
      "period",
      "file",
      "persons",
      // "artworksNL",
      "artworksEN",
      "recipient",
      "sender",
    ],
    detailPanels: [
      {
        name: "facs",
        visible: true,
        disabled: false,
        size: "minmax(300px, 650px)",
        panel: PanelTemplates.facsPanel,
      },
      {
        name: "text.orig",
        visible: true,
        disabled: false,
        size: "minmax(300px, 750px)",
        panel: TextPanels.origTextPanel,
      },
      {
        name: "text.trans",
        visible: true,
        disabled: false,
        size: "minmax(300px, 750px)",
        panel: TextPanels.transTextPanel,
      },
      {
        name: "metadata",
        visible: true,
        disabled: false,
        size: "minmax(300px, 400px)",
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
      { code: "nl", labels: dutchVangoghLabels },
      { code: "en", labels: englishVangoghLabels },
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
