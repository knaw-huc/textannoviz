import React from "react";
import { AnnoRepoAnnotation } from "../../../../model/AnnoRepoAnnotation";
import { ProjectConfig } from "../../../../model/ProjectConfig";
import { GetAnnotationButtons } from "../GetAnnotationButtons";
import { GetAnnotationItemContent } from "../GetAnnotationItemContent";
import { GetHome } from "../GetHome";
import { RenderMetadataPanel } from "../RenderMetadataPanel";
import { getAnnotationItem } from "../getAnnotationItem";

export const mondriaanConfig: ProjectConfig = {
  id: "mondriaan",
  broccoliUrl: "https://broccoli.tt.di.huc.knaw.nl",
  colours: {},
  relativeTo: "tf:Letter",
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
  letters: [
    "19090216y_IONG_1303",
    "19090407y_IONG_1739",
    "19090421y_IONG_1304",
    "19090426y_IONG_1738",
    "19090513y_IONG_1293",
    "19090624_IONG_1294",
    "19090807y_IONG_1296",
    "19090824y_KNAP_1747",
    "19090905y_IONG_1295",
    "190909XX_QUER_1654",
    "19091024_SPOO_0016",
    "19091024y_IONG_1297",
    "19091025y_IONG_1298",
    "19100131_SAAL_ARNO_0018",
  ],
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
        element: comp1,
        errorElement: errorComp,
      },
      {
        path: "detail/:tier0/:tier1",
        element: comp2,
        errorElement: errorComp,
      },
      {
        path: "search",
        element: comp3,
        errorElement: errorComp,
      },
      {
        path: "/detail/:tier2",
        element: comp2,
        errorElement: errorComp,
      },
    ];
  },

  renderHelp: () => {
    return <GetHome />;
  },
};
