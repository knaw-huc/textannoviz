import { AnnoRepoAnnotation } from "./AnnoRepoAnnotation";

export type Iiif = {
  manifest: string | null;
  canvasIds: string[];
};

export type BroccoliViews = {
  self: BroccoliTextGeneric;
};

export type Broccoli<V extends BroccoliViews = BroccoliViews> = {
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
  views: V;
};

export type ViewLang = "nl" | "en";

export type BroccoliRelativeAnno = {
  bodyId: string;
  begin: number;
  end: number;
};

export type BroccoliTextGeneric = {
  body: string;
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
