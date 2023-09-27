export type SessionBody = AnnoRepoBody & {
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

export type ResolutionBody = AnnoRepoBody & {
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

export type ReviewedBody = AnnoRepoBody & {
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

export type AttendanceListBody = AnnoRepoBody & {
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

export type AttendantBody = AnnoRepoBody & {
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

export type ScanBody = AnnoRepoBody & {
  metadata: {
    volume: string;
    opening: number;
  };
};

export type TeiDivBody = AnnoRepoBody & {
  metadata: {
    lang: string;
    type: string;
  };
};

export type TeiRsBody = AnnoRepoBody & {
  metadata: {
    key: string;
    type: string;
    anno: string;
  };
};

export type TeiObjectdescBody = AnnoRepoBody & {
  metadata: {
    form: string;
  };
};

export type TeiCorrespactionBody = AnnoRepoBody & {
  metadata: {
    type: string;
  };
};

export type TeiDateBody = AnnoRepoBody & {
  metadata: {
    when: string;
  };
};

export type TeiPtrBody = AnnoRepoBody & {
  metadata: {
    target: string;
    type?: string;
  };
};

export type TeiNoteBody = AnnoRepoBody & {
  metadata: {
    type?: string;
    id?: string;
  };
};

export type TeiRefBody = AnnoRepoBody & {
  metadata: {
    target: string;
  };
};

export type TeiRegBody = AnnoRepoBody & {
  metadata: {
    type: string;
  };
};

export type TfLetterBody = AnnoRepoBody & {
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

export type DocumentBody = AnnoRepoBody & {
  metadata: {
    document: string;
    manifest: string;
  };
};

export type PxPageBody = AnnoRepoBody & {
  metadata: {
    document: string;
    prevPageId: string;
    nextPageId: string;
  };
};

export type AnnoRepoBody = {
  id: string;
  type: string;
  metadata:
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
    | TfLetterBody;
};

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

export type TextTarget = {
  source: string;
  type: "Text";
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
