import merge from "lodash/merge";
import logo from "../../../assets/logo-correspondense-of-Suriano.png";
import {
  ProjectConfig,
  ProjectSpecificConfig,
} from "../../../model/ProjectConfig";
import { AnnotationButtons } from "../AnnotationButtons";
import { MetadataPanel } from "../MetadataPanel";
import { SearchItem } from "../SearchItem";
import { englishSurianoLabels } from "./englishSurianoLabels";
import { Header } from "../Header";

// import { TabRecipes } from "../../../components/Detail/TabRecipes.tsx";
import { Empty } from "../../../components/Empty.tsx";
import { EntitySummary } from "../annotation/EntitySummary.tsx";
// import {
//   getAnnotationCategory,
//   getHighlightCategory,
//   isEntity,
//   projectEntityTypes,
//   projectHighlightedTypes,
//   projectInsertTextMarkerAnnotationTypes,
//   projectPageMarkerAnnotationTypes,
// } from "../annotation/ProjectAnnotationModel.ts";
import { NotesPanel } from "../NotesPanel.tsx";
import { SearchInfoPage } from "../SearchInfoPage.tsx";

import projectCss from "../project.css?inline";
import { kunstenaarsbrievenConfig } from "../../kunstenaarsbrieven/config";
import { Persons } from "../Persons.tsx";
import { PanelTemplates } from "../../../components/Detail/PanelTemplates.tsx";
import { TextPanels } from "../../vangogh/TextPanels.tsx";
// import { Artworks } from "../../vangogh/Artworks.tsx";
// import { Bibliography } from "../../vangogh/Bibliography.tsx";

console.log("in suriano/config/index.tsx");

export const surianoConfig: ProjectConfig = merge(
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
      EntitySummary,
      AnnotationButtons,
      HelpLink: Empty,
      NotesPanel,
    },
    defaultKeywordAggsToRender: [
      "type",
      // "location",
      "period",
      "file",
      "persons",
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
    ],

    selectedLanguage: "en",
    languages: [{ code: "en", labels: englishSurianoLabels }],
    projectCss: projectCss,
    routes: [
      {
        path: "persons",
        element: <Persons />,
      },
    ],

    logoImageUrl: logo,

    // relativeTo: "tf:File",
    // showWebAnnoTab: true,
    // showNotesTab: true,
    // annotationTypesToInclude: [
    //   // "EntityMetadata",
    //   // "tei:Author",
    //   // "tei:Bibl",
    //   // "tei:BiblScope",
    //   // "tei:Body",
    //   // "tei:Cell",
    //   // "tei:Collection",
    //   // "tei:CorrespAction",
    //   // "tei:CorrespDesc",
    //   // "tei:Date",
    //   // "tei:Editor",
    //   // "tei:FileDesc",
    //   // "tei:Head",
    //   // "tei:Idno",
    //   // "tei:Institution",
    //   // "tei:MsDesc",
    //   // "tei:MsIdentifier",
    //   // "tei:Name",
    //   // "tei:Num",
    //   // "tei:P",
    //   // "tei:ProfileDesc",
    //   // "tei:PublicationStmt",
    //   // "tei:Quote",
    //   // "tei:Resp",
    //   // "tei:RespStmt",
    //   // "tei:Row",
    //   // "tei:Settlement",
    //   // "tei:SourceDesc",
    //   // "tei:Table",
    //   // "tei:TeiHeader",
    //   // "tei:Text",
    //   // "tei:Title",
    //   // "tei:TitleStmt",
    //   // "tf:Ln",
    //   "tei:Div",
    //   "tei:Note",
    //   "tei:Ptr",
    //   "tf:Ent",
    //   "tf:File",
    //   "tf:Folder",
    //   "tf:Page",
    //   "LetterBody",
    //   "tei:Hi",
    //   "tei:Head",
    //   "tei:Metamark",
    // ],
    // showAnnotations: true,
    // annotationTypesToHighlight: [],
    // entityAnnotationTypes: projectEntityTypes,
    // highlightedAnnotationTypes: projectHighlightedTypes,
    // // TODO: use Reference instead of tei:Ptr
    // pageMarkerAnnotationTypes: projectPageMarkerAnnotationTypes,
    // insertTextMarkerAnnotationTypes: projectInsertTextMarkerAnnotationTypes,
    //
    // getAnnotationCategory: getAnnotationCategory,
    // getHighlightCategory: getHighlightCategory,
    // isEntity: isEntity,
    //
    // showPrevNextScanButtons: true,
    // pageAnnotation: "tf:Page",
    // initialRangeFrom: "0",
    // initialRangeTo: "30000",
    // maxRange: 30000,
    // showSearchResultsButtonFooter: false,
    // useExternalConfig: true,
    // showToggleTextPanels: false,
    // showKeywordFacets: false,
    // showFacetFilter: false,
    // showMiradorNavigationButtons: false,
    // showSearchResultsOnInfoPage: true,
    // overrideDefaultSearchParams: {
    //   sortBy: "date",
    //   sortOrder: "asc",
    // },
  } as ProjectSpecificConfig,
);
