import { AnnoRepoAnnotation } from "./AnnoRepoAnnotation";

export interface Broccoli {
  request: OpeningRequest | ResolutionRequest; //in generic version overlapTypes is optional
  iiif: {
    manifest: string;
    canvasIds: string[];
  };
  anno: AnnoRepoAnnotation[];
  text: BroccoliTextGeneric;
}

export interface OpeningRequest {
  tier0: string;
  tier1: number;
}

export interface ResolutionRequest {
  resolutionId: string;
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
