import React from "react";
import logo from "../../../../assets/logo-republic-temp.png";
import { AnnoRepoAnnotation } from "../../../../model/AnnoRepoAnnotation";
import { ProjectConfig } from "../../../../model/ProjectConfig";
import { englishLabels } from "../../default/config/englishLabels.ts";
import { GetAnnotationButtons } from "../GetAnnotationButtons";
import { GetAnnotationItemContent } from "../GetAnnotationItemContent";
import { GetHelp } from "../GetHelp.tsx";
import { RenderMetadataPanel } from "../RenderMetadataPanel";
import { RenderSearchInfoPage } from "../RenderSearchInfoPage.tsx";
import { getAnnotationItem } from "../getAnnotationItem";

export const mondriaanConfig: ProjectConfig = {
  id: "mondriaan",
  broccoliUrl: "https://broccoli.tt.di.huc.knaw.nl",
  colours: {},
  relativeTo: "tf:Letter",
  annotationTypesToZoom: [],
  annotationTypesToInclude: [
    // "nlp:Sentence",
    // "nlp:Token",
    "tei:Abbr",
    "tei:AccMat",
    "tei:Add",
    "tei:AddrLine",
    "tei:Address",
    "tei:AltIdentifier",
    "tei:Body",
    "tei:Change",
    "tei:Choice",
    "tei:Closer",
    "tei:CorrespAction",
    "tei:CorrespDesc",
    "tei:Country",
    "tei:Date",
    "tei:Dateline",
    "tei:DecoDesc",
    "tei:DecoNote",
    "tei:Del",
    "tei:Div",
    "tei:Editor",
    "tei:Expan",
    "tei:Facsimile",
    "tei:FileDesc",
    "tei:Graphic",
    "tei:Hi",
    "tei:Idno",
    "tei:Institution",
    "tei:Lb",
    "tei:ListAnnotation",
    "tei:MsDesc",
    "tei:MsIdentifier",
    "tei:Name",
    "tei:Note",
    "tei:ObjectDesc",
    "tei:Opener",
    "tei:Orig",
    "tei:P",
    "tei:PhysDesc",
    "tei:PlaceName",
    "tei:Postmark",
    "tei:Postscript",
    "tei:ProfileDesc",
    "tei:Ptr",
    "tei:PublicationStmt",
    "tei:Ref",
    "tei:Reg",
    "tei:RevisionDesc",
    "tei:Rs",
    "tei:Salute",
    "tei:Settlement",
    "tei:Signed",
    "tei:SourceDesc",
    "tei:Space",
    "tei:Sponsor",
    "tei:StandOff",
    "tei:Surface",
    "tei:TeiHeader",
    "tei:Text",
    "tei:Title",
    "tei:TitleStmt",
    "tei:Unclear",
    "tei:Zone",
    "tf:Chunk",
    "tf:Folder",
    "tf:Letter",
    "tf:Page",
  ],
  tier: ["folders", "letters"],
  bodyType: [],
  scanAnnotation: "tf:Letter",
  elasticIndexName: "divs",
  initialDateFrom: "1909-01-01",
  initialDateTo: "1910-12-31",
  textPanelTitles: {
    textOrig: "Originele tekst",
    textTrans: "Vertaling",
    notesEN: "Notities",
    title: "Titel",
    textFull: "Volledige tekst",
    postalData: "Adresgegevens",
    self: "Volledige tekst",
  },
  allPossibleTextPanels: [
    "textOrig",
    "textTrans",
    "notesEN",
    "title",
    "postalData",
  ],
  defaultTextPanels: ["textOrig", "textTrans"],
  metadataPanelTitles: {
    correspondent: "Correspondent",
    country: "Country",
    file: "File",
    institution: "Institution",
    letterid: "Letter ID",
    location: "Location",
    msid: "Shelfmark",
    period: "Period",
    periodlong: "Period (long)",
    sender: "Sender",
    type: "Type",
    folder: "Folder",
  },
  showSearchSortBy: true,
  showFacsimileButtonFooter: true,
  showSearchResultsButtonFooter: true,
  defaultShowMetadataPanel: true,
  showToggleTextPanels: true,
  zoomAnnoMirador: true,
  logoImageUrl: logo,
  headerTitle: "MONDRIAAN",
  logoHref:
    "https://rkd.nl/nl/projecten-en-publicaties/projecten/130-mondriaan-editieproject",
  showSearchQueryHistory: true,
  showDateFacets: true,
  showKeywordFacets: true,
  showSelectedFilters: true,

  renderAnnotationItem: (annotation: AnnoRepoAnnotation) =>
    getAnnotationItem(annotation),

  renderAnnotationItemContent: (annotation: AnnoRepoAnnotation) => {
    return <GetAnnotationItemContent annotation={annotation} />;
  },

  renderAnnotationButtons: (
    nextOrPrevButtonClicked: (clicked: boolean) => boolean,
  ) => {
    return (
      <GetAnnotationButtons nextOrPrevButtonClicked={nextOrPrevButtonClicked} />
    );
  },

  renderMetadataPanel: (annotations: AnnoRepoAnnotation[]) => {
    return <RenderMetadataPanel annotations={annotations} />;
  },

  createRouter: (
    comp1: React.ReactNode,
    comp2: React.ReactNode,
    comp3: React.ReactNode,
    errorComp: React.ReactNode,
  ) => {
    return [
      {
        path: "/",
        element: comp3,
        errorElement: errorComp,
      },
      {
        path: "detail/:tier0/:tier1",
        element: comp2,
        errorElement: errorComp,
      },
      {
        path: "detail/:tier2",
        element: comp2,
        errorElement: errorComp,
      },
      {
        path: "help",
        element: comp1,
        errorElement: errorComp,
      },
    ];
  },

  renderHelp: () => {
    return <GetHelp />;
  },
  renderSearchInfoPage: () => {
    return <RenderSearchInfoPage />;
  },
  labels: englishLabels,
  mirador: {
    showWindowSideBar: false,
    showTopMenuButton: true
  },
};
