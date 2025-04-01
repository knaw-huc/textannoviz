import { AnnoRepoAnnotation } from "./AnnoRepoAnnotation";

export type Iiif = {
  manifest: string;
  canvasIds: string[];
};

export type Broccoli = {
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
  views: Record<string, BroccoliTextGeneric>;
};

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

export type BroccoliTextGeneric = {
  lines: string[];
  locations: {
    relativeTo: {
      bodyType: string;
      bodyId: string;
    };
    annotations: BroccoliRelativeAnno[];
  };
};

export type BroccoliBodyIdResult = {
  request: {
    projectId: string;
    bodyType: string;
    tier: string[];
    includedResults: string[];
  };
  bodyId: string;
};
