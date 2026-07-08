import mergeWith from "lodash/mergeWith";
import logo from "../../../assets/logo-republic-temp.png";
import { DefaultProjectConfig } from "../../../model/ProjectConfig";
import { defaultConfig } from "../../default/config";
import { defaultAnnotatedTextComponents } from "../../default/annotation/defaultAnnotatedTextComponents.ts";
import { KunstenaarsbrievenMarker } from "../annotation/marker/KunstenaarsbrievenMarker";
import { NotesPanel } from "../NotesPanel";
import {
  blockSchema,
  document,
  entityTypes,
  getAnnotationCategory,
  getBlockType,
  getHighlightCategory,
  getMarkerPosition,
  highlightTypes,
  isBlock,
  isEntity,
  isMarker,
  letter,
  note,
  person,
  reference,
  teiArtwork,
  typesToInclude,
} from "../annotation/ProjectAnnotationModel";
import { ArtworksTab } from "../ArtworksTab";
import { SearchItem } from "../SearchItem";
import { ASC, DESC } from "../../../model/Search";
import { Any } from "../../../utils/Any";
import { Header } from "../Header";
import { getTocId, showToc } from "../TocUtils.ts";
import { TocPanel } from "../TocPanel.tsx";
import { getUrl, isLink } from "../annotation/LinkUtils.ts";
import { filterPanels } from "../filterPanels.ts";
import { KunstenaarsbrievenBlock } from "../annotation/block/KunstenaarsbrievenBlock.tsx";
import { KunstenaarsbrievenHighlight } from "../annotation/KunstenaarsbrievenHighlight.tsx";
import { EntitySummary } from "../annotation/EntitySummary.tsx";
import { replaceArrays } from "../../default/config/replaceArrays.ts";
import { KunstenaarsbrievenGroup } from "../annotation/group/KunstenaarsbrievenGroup.tsx";

export const kunstenaarsbrievenConfig: DefaultProjectConfig = mergeWith(
  {},
  defaultConfig,
  {
    relativeTo: document,
    annotationTypesToInclude: [
      "Dataset",
      "Division",
      "List",
      document,
      letter,
      note,
      ...typesToInclude,
    ],
    showAnnotations: true,
    annotatedTextComponents: {
      ...defaultAnnotatedTextComponents,
      Marker: KunstenaarsbrievenMarker,
      Block: KunstenaarsbrievenBlock,
      Highlight: KunstenaarsbrievenHighlight,
      Group: KunstenaarsbrievenGroup,
    },
    highlightTypes: highlightTypes,
    nestedTypes: entityTypes,
    isMarker: isMarker,
    getMarkerPosition: getMarkerPosition,
    isBlock: isBlock,
    getBlockType: getBlockType,
    blockSchema: blockSchema,
    getAnnotationCategory: getAnnotationCategory,
    getHighlightCategory: getHighlightCategory,
    isEntity: isEntity,

    initialRangeFrom: "0",
    initialRangeTo: "30000",
    maxRange: 30000,
    logoImageUrl: logo,
    showSearchResultsButtonFooter: false,
    useExternalConfig: true,
    showToggleTextPanels: true,
    showSearchResultsOnInfoPage: true,
    showWebAnnoTab: true,
    showFragmenter: true,
    showNotesTab: true,
    showArtworksTab: true,
    components: {
      SearchItem,
      NotesPanel,
      ArtworksTab,
      Header,
      TocPanel,
      EntitySummary,
    },
    zoomAnnoMirador: true,
    miradorZoomRatio: 1.5,
    allPossibleTextPanels: [
      "text",
      "textNotes",
      "transcrSource",
      "dating",
      "remarks",
      "ogtNotes",
    ],
    defaultTextPanels: "text",
    searchSorting: [
      { name: "Letter number (ascending)", value: `file-${ASC}` },
      { name: "Letter number (descending)", value: `file-${DESC}` },
    ],
    overrideDefaultSearchParams: {
      sortBy: "file",
      sortOrder: "asc",
      size: 50,
    },
    annoToEntityCategory: {
      [person]: "PER",
      [teiArtwork]: "ART",
      [reference.toLowerCase()]: "REF",
      PER: "PER",
    } as Any,
    showMiradorNavigationButtons: true,
    showSearchInTextViews: true,
    showToc: showToc,
    getTocId: getTocId,
    isLink: isLink,
    getUrl: getUrl,
    filterPanels: filterPanels,
  },
  replaceArrays,
);
