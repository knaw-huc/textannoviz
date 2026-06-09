import mergeWith from "lodash/mergeWith";
import logo from "../../../assets/logo-correspondense-of-Suriano.png";
import {
  ProjectConfig,
  ProjectSpecificConfig,
} from "../../../model/ProjectConfig";
import { defaultAnnotatedTextComponents } from "../../default/annotation/defaultAnnotatedTextComponents.ts";
import { MetadataPanel } from "../MetadataPanel";
import { SearchItem } from "../SearchItem";
import { englishSurianoLabels } from "./englishSurianoLabels";

import {
  entityTypes,
  highlightTypes,
  insertTextMarkerTypes,
  markerTypes,
} from "../annotation/ProjectAnnotationModel.ts";
import { Header } from "../Header";
import { SearchInfoPage } from "../SearchInfoPage.tsx";
import { kunstenaarsbrievenConfig } from "../../kunstenaarsbrieven/config";
import { Persons } from "../Persons.tsx";
import { PanelTemplates } from "../../../components/Detail/PanelTemplates";
import { TextPanels } from "../TextPanels.tsx";
import { Empty } from "../../../components/Empty";
import { SurianoMarker } from "../annotation/SurianoMarker.tsx";
import { EntitySummaryDetails } from "../annotation/EntitySummaryDetails.tsx";
import { replaceArrays } from "../../default/config/replaceArrays.ts";

export const surianoConfig: ProjectConfig = mergeWith(
  {},
  kunstenaarsbrievenConfig,
  {
    id: "suriano",
    broccoliUrl: "http://localhost:8082",
    siteTitle: "Correspondence of Suriano",
    elasticIndexName: "suriano",
    initialDateFrom: "1600-01-01",
    initialDateTo: "1700-01-01",
    headerColor: "bg-brand2-800 text-white",
    headerTitle: "Correspondence of Suriano",
    personsUrl:
      "http://localhost:8040/files/suriano/apparatus/bio-entities.json",
    components: {
      Header,
      SearchItem,
      MetadataPanel,
      SearchInfoPage,
      EntitySummaryDetails,
      ArtworksTab: Empty,
    },
    defaultKeywordAggsToRender: ["persons", "recipient", "sender"],
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
    overrideDefaultAggs: [
      {
        facetName: "persons",
        order: "keyAsc",
        size: 9999,
      },
    ],
    viewsToSearchIn: ["letterOriginalText", "letterNotesText"],
    showFacsimilePrevNextScanButtonsButtons: false,
    selectedLanguage: "en",
    languages: [{ code: "en", labels: englishSurianoLabels }],
    routes: [
      {
        path: "persons",
        element: <Persons />,
      },
    ],
    logoImageUrl: logo,
    overrideDefaultSearchParams: {
      sortBy: "file",
      sortOrder: "asc",
    },
    zoomToAnnoOnFacsimile: true,
    // TODO: how to test this?
    showAnnosOnFacsimile: true,
    annotatedTextComponents: {
      ...defaultAnnotatedTextComponents,
      Marker: SurianoMarker,
    },
    textHighlightingTypes: [],
    nestedTypes: entityTypes,
    isMarker: (body) =>
      [...markerTypes, ...insertTextMarkerTypes].includes(body.type),
    highlightTypes: highlightTypes,
  } as ProjectSpecificConfig,
  replaceArrays,
);
