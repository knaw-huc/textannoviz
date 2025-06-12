import { AnnoRepoAnnotation } from "./AnnoRepoAnnotation";

export type Iiif = {
  manifest: string;
  canvasIds: string[];
};

export interface Broccoli {
  request: {
    projectId: string;
    bodyId: string;
    includeResults: string[];
    overlapTypes?: string[];
    relativeTo: string;
  };
  iiif: Iiif;
  anno: AnnoRepoAnnotation[];
  text: BroccoliTextGeneric;
  views: {
    text: Record<ViewLang, BroccoliTextGeneric>;
    textNotes: Record<ViewLang, Record<string, BroccoliTextGeneric>>;
    typedNotes: Record<ViewLang, BroccoliTextGeneric>;
    //TODO: what is the model of `self`?
    self: Record<ViewLang, BroccoliTextGeneric>;
  };
}

export type ViewLang = "nl" | "en";

export type BroccoliRelativeAnno = {
  bodyId: string;
  start: {
    line: number;
    offset?: number;
  };
  end: {
    line: number;
    offset?: number;
  };
};

export interface BroccoliTextGeneric {
  lines: string[];
  locations: {
    relativeTo: {
      bodyType: string;
      bodyId: string;
    };
    annotations: BroccoliRelativeAnno[];
  };
}

export interface BroccoliBodyIdResult {
  request: {
    projectId: string;
    bodyType: string;
    tier: string[];
    includedResults: string[];
  };
  bodyId: string;
}
