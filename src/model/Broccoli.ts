import { AnnoRepoAnnotation } from "./AnnoRepoAnnotation";

export interface Broccoli {
  request: {
    projectId: string;
    bodyId: string;
    includeResults: string[];
    overlapTypes?: string[];
    relativeTo: string;
  };
  iiif: {
    manifest: string;
    canvasIds: string[];
  };
  anno: AnnoRepoAnnotation[];
  text: BroccoliTextGeneric;
  views: Record<string, BroccoliTextGeneric>;
}

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
