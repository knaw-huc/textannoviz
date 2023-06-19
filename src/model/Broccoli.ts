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
  views: {
    [key: string]: BroccoliTextGeneric;
  };
}

export interface BroccoliTextGeneric {
  lines: string[];
  locations: {
    relativeTo: {
      bodyType: string;
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

export interface BroccoliBodyIdResult {
  request: {
    projectId: string;
    bodyType: string;
    tier: string[];
    includedResults: string[];
  };
  bodyId: string;
}
