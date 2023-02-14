import { AnnoRepoAnnotation } from "./AnnoRepoAnnotation";

export interface BroccoliV3 {
  type: string;
  request: OpeningRequest | ResolutionRequest;
  iiif: {
    manifest: string;
    canvasIds: string[];
  };
  anno: AnnoRepoAnnotation[];
  text: BroccoliText;
}

export interface OpeningRequest {
  tier0: string;
  tier1: number;
}

export interface ResolutionRequest {
  resolutionId: string;
}

export interface BroccoliText {
  location: {
    relativeTo: string;
    start: {
      line: number;
      offset: number;
      len: number;
    };
    end: {
      line: number;
      offset: number;
      len: number;
    };
  };
  lines: string[];
}
