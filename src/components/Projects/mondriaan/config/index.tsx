import React from "react";
import { AnnoRepoAnnotation } from "../../../../model/AnnoRepoAnnotation";
import { ProjectConfig } from "../../../../model/ProjectConfig";
import { GetAnnotationButtons } from "../GetAnnotationButtons";
import { GetAnnotationItemContent } from "../GetAnnotationItemContent";
import { GetHome } from "../GetHome";
import { getAnnotationItem } from "../getAnnotationItem";

export const mondriaanConfig: ProjectConfig = {
  id: "mondriaan",
  colours: {},
  relativeTo: "Letter",
  annotationTypes: [
    "tei:Add",
    "tei:Address",
    "tei:Addrline",
    "tei:Altidentifier",
    "tei:Body",
    "tei:C",
    "tei:Change",
    "tei:Choice",
    "tei:Chunk",
    "tei:Closer",
    "tei:Correspaction",
    "tei:Correspdesc",
    "tei:Country",
    "tei:Date",
    "tei:Dateline",
    "tei:Decodesc",
    "tei:Deconote",
    "tei:Del",
    "tei:Div",
    "tei:Editor",
    "tei:Facsimile",
    "tei:Filedesc",
    "tei:Graphic",
    "tei:Hi",
    "tei:Idno",
    "tei:Institution",
    "tei:Msdesc",
    "tei:Msidentifier",
    "tei:Name",
    "tei:Note",
    "tei:Objectdesc",
    "tei:Opener",
    "tei:Orig",
    "tei:P",
    "tei:Physdesc",
    "tei:Placename",
    "tei:Postmark",
    "tei:Postscript",
    "tei:Profiledesc",
    "tei:Ptr",
    "tei:Publicationstmt",
    "tei:Ref",
    "tei:Reg",
    "tei:Revisiondesc",
    "tei:Rs",
    "tei:Salute",
    "tei:Settlement",
    "tei:Signed",
    "tei:Sourcedesc",
    "tei:Space",
    "tei:Sponsor",
    "tei:Surface",
    "tei:Teiheader",
    "tei:Text",
    "tei:Title",
    "tei:Titlestmt",
    "tei:Unclear",
    "Folder",
    "Letter",
    "Page",
    "Sentence",
  ],
  annotationTypesToInclude: [
    "tei:Add",
    "tei:Address",
    "tei:Addrline",
    "tei:Altidentifier",
    "tei:Body",
    "tei:C",
    "tei:Change",
    "tei:Choice",
    "tei:Closer",
    "tei:Correspaction",
    "tei:Correspdesc",
    "tei:Country",
    "tei:Date",
    "tei:Dateline",
    "tei:Decodesc",
    "tei:Deconote",
    "tei:Del",
    "tei:Div",
    "tei:Editor",
    "tei:Facsimile",
    "tei:Filedesc",
    "tei:Graphic",
    "tei:Hi",
    "tei:Idno",
    "tei:Institution",
    "tei:Msdesc",
    "tei:Msidentifier",
    "tei:Name",
    "tei:Note",
    "tei:Objectdesc",
    "tei:Opener",
    "tei:Orig",
    "tei:P",
    "tei:Physdesc",
    "tei:Placename",
    "tei:Postmark",
    "tei:Postscript",
    "tei:Profiledesc",
    "tei:Ptr",
    "tei:Publicationstmt",
    "tei:Ref",
    "tei:Reg",
    "tei:Revisiondesc",
    "tei:Rs",
    "tei:Salute",
    "tei:Settlement",
    "tei:Signed",
    "tei:Sourcedesc",
    "tei:Space",
    "tei:Sponsor",
    "tei:Surface",
    "tei:Teiheader",
    "tei:Text",
    "tei:Title",
    "tei:Titlestmt",
    "tei:Unclear",
    "Folder",
    "Letter",
    "Page",
    "Sentence",
  ],
  tier: ["folders", "letters"],
  bodyType: [],
  scanAnnotation: "Letter",
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

  renderAnnotationItem: (annotation: AnnoRepoAnnotation) =>
    getAnnotationItem(annotation),

  renderAnnotationItemContent: (annotation: AnnoRepoAnnotation) => {
    return <GetAnnotationItemContent annotation={annotation} />;
  },

  renderAnnotationButtons: (
    nextOrPrevButtonClicked: (clicked: boolean) => boolean
  ) => {
    return (
      <GetAnnotationButtons nextOrPrevButtonClicked={nextOrPrevButtonClicked} />
    );
  },

  createRouter: (
    comp1: React.ReactNode,
    comp2: React.ReactNode,
    comp3: React.ReactNode,
    errorComp: React.ReactNode
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

  renderHome: () => {
    return <GetHome />;
  },
};
