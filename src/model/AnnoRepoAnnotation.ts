export type SessionBody = AnnoRepoBodyBase & {
  metadata: {
    dateShiftStatus: string;
    hasSessionDateElement: boolean;
    inventoryNum: number;
    isWorkday: boolean;
    linesIncludeRestDay: boolean;
    resolutionIds: [];
    sessionDate: string;
    sessionDay: number;
    sessionMonth: number;
    sessionNum: number;
    sessionWeekday: string;
    sessionYear: number;
    textPageNum: number[];
  };
};

export type ResolutionBody = AnnoRepoBodyBase & {
  metadata: {
    inventoryNum: number;
    sourceId: string;
    sessionDate: string;
    sessionId: string;
    sessionNum: number;
    president: null;
    sessionYear: number;
    sessionMonth: number;
    sessionDay: number;
    sessionWeekday: string;
    propositionType: string;
    proposer: null;
    decision: null;
    resolutionType: string;
    textPageNum: number[];
    propositionOrigin: {
      location: {
        text: string;
      };
    };
    propositionOrganisation: string;
    proposerRole: string;
  };
};

export type ReviewedBody = AnnoRepoBodyBase & {
  metadata: {
    inventoryNum: number;
    sourceId: string;
    textPageNum: number[];
    pageNum: number[];
    startOffset: number;
    iiifUrl: string;
    docId: string;
    lang: string;
    paragraphIndex: number;
  };
  text: string;
};

export type AttendanceListBody = AnnoRepoBodyBase & {
  metadata: {
    inventoryNum: number;
    sourceId: string;
    sessionDate: string;
    sessionId: string;
    sessionNum: number;
    sessionYear: number;
    sessionMonth: number;
    sessionDay: number;
    sessionWeekday: string;
    textPageNum: number[];
  };
  attendanceSpans: attendanceSpansType[];
};

type attendanceSpansType = {
  offset: number;
  end: number;
  class: string;
  pattern: string;
  delegateId: number;
  delegateName: string;
  delegateScore: number;
};

export type AttendantBody = AnnoRepoBodyBase & {
  metadata: {
    offset: number;
    end: number;
    class: string;
    pattern: string;
    delegateId: number;
    delegateName: string;
    delegateScore: number;
  };
};

export type ScanBody = AnnoRepoBodyBase & {
  metadata: {
    volume: string;
    opening: number;
  };
};

export type TeiDivBody = AnnoRepoBodyBase & {
  metadata: {
    lang: string;
    type: string;
  };
};

export type TeiRsBody = AnnoRepoBodyBase & {
  metadata: {
    key: string;
    type: string;
    anno: string;
  };
};

export type TeiObjectdescBody = AnnoRepoBodyBase & {
  metadata: {
    form: string;
  };
};

export type TeiCorrespactionBody = AnnoRepoBodyBase & {
  metadata: {
    type: string;
  };
};

export type TeiDateBody = AnnoRepoBodyBase & {
  metadata: {
    when: string;
  };
};

export type TeiPtrBody = AnnoRepoBodyBase & {
  metadata: {
    target: string;
    type?: string;
  };
};

export type TeiNoteBody = AnnoRepoBodyBase & {
  metadata: {
    type?: string;
    id?: string;
  };
};

export type TeiRefBody = AnnoRepoBodyBase & {
  metadata: {
    target: string;
  };
};

export type TeiRegBody = AnnoRepoBodyBase & {
  metadata: {
    type: string;
  };
};

export type TfLetterBody = AnnoRepoBodyBase & {
  metadata: {
    correspondent: string;
    country: string;
    file: string;
    institution: string;
    letterid: string;
    location: string;
    msid: string;
    period: string;
    periodlong: string;
    sender: string;
    type: string;
    folder: string;
  };
};

export type SurianoTfFileBody = AnnoRepoBodyBase & {
  metadata: {
    date: string;
    editornotes: string;
    file: string;
    recipient: string;
    recipientloc: string;
    sender: string;
    senderloc: string;
    shelfmark: string;
    summary: string;
    type: string;
    prevFile: string;
    nextFile: string;
  };
};

export type DocumentBody = AnnoRepoBodyBase & {
  metadata: {
    document: string;
    manifest: string;
  };
};

export type PxPageBody = AnnoRepoBodyBase & {
  metadata: {
    document: string;
    prevPageId: string;
    nextPageId: string;
  };
};

export type AnnoRepoBodyBase = {
  id: string;
  type: string;
  metadata: {
    category?: string;
  };
};

export type EntityBody = AnnoRepoBodyBase & {
  type: "Entity";
  text: string;
  metadata: {
    entityId: string;
    entityLabels: string[];
    inventoryNum: string;
    name: string;
  };
};

export function isEntityBody(toTest: AnnoRepoBody): toTest is EntityBody {
  if (!toTest) {
    return false;
  }
  return toTest.type === "Entity";
}

export type NoteBody = AnnoRepoBodyBase & {
  type: "tei:Note";
  "tf:textfabricNode": string;
  metadata: {
    "tei:id": string;
    lang: string;
    type: "tt:NoteMetadata";
  };
};

export function isNoteBody(toTest: AnnoRepoBody): toTest is NoteBody {
  if (!toTest) {
    return false;
  }
  return toTest.type === "tei:Note";
}

export type MarkerBody = AnnoRepoBodyBase & {
  type: "tei:Ptr";
  "tf:textfabricNode": string;
  metadata: {
    n: string;
    target: string;
    type: "tt:PtrMetadata";
  };
};

export type AnnoRepoBody =
  | SessionBody
  | ResolutionBody
  | ReviewedBody
  | AttendanceListBody
  | AttendantBody
  | TeiDivBody
  | TeiRsBody
  | TeiObjectdescBody
  | TeiCorrespactionBody
  | TeiDateBody
  | TeiPtrBody
  | TeiNoteBody
  | TeiRefBody
  | TeiRegBody
  | TfLetterBody
  | EntityBody
  | MarkerBody
  | NoteBody;

export type Body =
  | AnnoRepoBody
  | SessionBody
  | ResolutionBody
  | ReviewedBody
  | AttendanceListBody
  | AttendantBody
  | TeiDivBody;

export type ImageTarget = {
  type: "Image";
  selector: ImageSelector[] | undefined;
  source: string;
};

export type FragmentSelector = {
  type: "FragmentSelector";
  conformsTo: string;
  value: string;
};

export type SvgSelector = {
  type: "SvgSelector";
  value: string;
};

export type CanvasTarget = {
  source: string;
  type: "Canvas";
  selector: CanvasSelector[] | undefined;
};

export type ImageApiSelector = {
  type: "iiif:ImageApiSelector";
  region: string;
};

export type CanvasSelector = ImageApiSelector | SvgSelector;

export type ImageSelector = FragmentSelector | SvgSelector;

export type SvgSelectorTarget = {
  source: string;
  type: "Image";
  selector: {
    type: "SvgSelector";
    value: string;
  };
};

export type TextAnchorTarget = {
  source: string;
  type: "Text";
  selector: {
    type: "urn:republic:TextAnchorSelector";
    end: number;
    start: number;
    beginCharOffset: number;
    endCharOffset: number;
  };
};

export function isLogicalTextAnchorTarget(
  toTest: Target,
): toTest is TextAnchorTarget {
  return (
    toTest.type === "LogicalText" && !!(toTest as TextAnchorTarget).selector
  );
}

export type TextTarget = {
  source: string;
  type: "Text" | "LogicalText";
};

export type Target =
  | TextAnchorTarget
  | ImageTarget
  | TextTarget
  | SvgSelectorTarget
  | CanvasTarget;

export type AnnoRepoAnnotation = {
  id: string;
  body: AnnoRepoBody;
  target: Target | Target[];
};

export type iiifAnn = {
  "@context": string;
  "@id": string;
  "@type": string;
  resources: iiifAnnResources[];
};

export type iiifAnnResources =
  | {
      "@id": string;
      on: [
        {
          full: string;
          selector: {
            item: {
              "@type": string;
              value: string;
            };
          };
        },
      ];
    }
  | undefined;
