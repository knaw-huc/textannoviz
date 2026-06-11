import mergeWith from "lodash/mergeWith";
import {
  ProjectConfig,
  ProjectSpecificConfig,
} from "../../../model/ProjectConfig";
import { Header } from "../Header";
import { SearchItem } from "../SearchItem";
import { MetadataPanel } from "../MetadataPanel";
import { SearchInfoPage } from "../SearchInfoPage";
import { TextPanels } from "../TextPanels";
import { PanelTemplates } from "../../../components/Detail/PanelTemplates";
import { replaceArrays } from "../../default/config/replaceArrays";
import { dutchNvvLabels } from "./dutchNvvLabels.ts";
import { ASC, DESC } from "../../../model/Search.ts";
import { filterPanels } from "../filterPanels.ts";
import { kunstenaarsbrievenConfig } from "../../kunstenaarsbrieven/config";
import { document } from "../../kunstenaarsbrieven/annotation/ProjectAnnotationModel.ts";
import { defaultAnnotatedTextComponents } from "../../default/annotation/defaultAnnotatedTextComponents.ts";
import { NVVMarker } from "../annotation/NVVMarker.tsx";
import { pageMarkerTypes } from "../annotation/ProjectAnnotationModel.ts";

export const nvvConfig: ProjectConfig = mergeWith(
  {},
  kunstenaarsbrievenConfig,
  {
    id: "nvv",
    broccoliUrl: "http://localhost:8082",
    siteTitle: "NVV Archief",

    elasticIndexName: "nvv",
    initialDateFrom: "1900-01-01",
    initialDateTo: "1999-12-31",
    headerColor: "bg-[#dddddd] text-black border-b border-neutral-400",
    headerTitle: "NVV Archief",
    annotationTypesToInclude: ["Division", "Page", "Unit"],
    showAnnotations: true,
    components: {
      Header,
      SearchItem,
      // MetadataPanel is too project-specific to make generic
      MetadataPanel,
      // SearchInfoPage is too project-specific to make generic
      SearchInfoPage,
    },
    annotatedTextComponents: {
      ...defaultAnnotatedTextComponents,
      Marker: NVVMarker,
    },

    defaultKeywordAggsToRender: ["file"],
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
        name: "text",
        visible: true,
        disabled: false,
        region: "main",
        size: "minmax(300px, 750fr)",
        panel: TextPanels.origTextPanel,
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
    allPossibleTextPanels: ["text"], // NB: because of the merge(), this value is not overwritten, but this value is added to the original.
    defaultTextPanels: "text",

    overrideDefaultAggs: [
      {
        facetName: "file",
        order: "keyAsc",
        size: 9999,
      },
    ],
    viewsToSearchIn: ["unitText"],

    languages: [{ code: "nl", labels: dutchNvvLabels }],
    selectedLanguage: "nl",

    zoomAnnoMirador: true,
    miradorZoomRatio: 1.5,

    zoomToAnnoOnFacsimile: true,
    showAnnosOnFacsimile: true,
    showFacsimilePrevNextScanButtonsButtons: true,
    showSearchResultsOnInfoPage: true,
    searchSorting: [
      { name: "Vergaderstuk (oplopend)", value: `file-${ASC}` },
      { name: "Vergaderstuk (aflopend)", value: `file-${DESC}` },
    ],
    overrideDefaultSearchParams: {
      sortBy: "file",
      sortOrder: "asc",
    },
    showMiradorNavigationButtons: true,
    showSearchInTextViews: false,
    showToc: () => false,
    isMarker: (body) => pageMarkerTypes.includes(body.type),

    filterPanels: filterPanels,
    relativeTo: document,
  } as ProjectSpecificConfig,
  replaceArrays,
);
