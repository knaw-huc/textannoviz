import { AnnoRepoAnnotation } from "./AnnoRepoAnnotation";

export interface BroccoliV3 {
  type: string;
  request: OpeningRequest | ResolutionRequest; //in generic version overlapTypes is optional
  iiif: {
    manifest: string;
    canvasIds: string[];
  };
  anno: AnnoRepoAnnotation[];
  text: BroccoliTextV3 | BroccoliTextGeneric;
}

export interface OpeningRequest {
  tier0: string;
  tier1: number;
}

export interface ResolutionRequest {
  resolutionId: string;
}

export interface BroccoliTextV3 {
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

export interface BroccoliTextGeneric {
  lines: string[];
  locations: {
    relativeTo: {
      type: string;
      bodyId: string;
    };
    annotations: {
      bodyId: string;
      start: {
        line: number;
        offset?: number;
      };
      end: {
        line: number;
        offset?: number;
      };
    }[];
  };
}
