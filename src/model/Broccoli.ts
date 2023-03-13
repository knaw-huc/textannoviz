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
