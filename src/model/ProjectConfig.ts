import { AnnoRepoAnnotation } from "./AnnoRepoAnnotation";

export interface ProjectConfig {
  id: string;
  colours: {
    [key: string]: string;
  };
  relativeTo: string;
  annotationTypes: string[];
  annotationTypesToInclude: string[];
  broccoliVersion: string;
  tier: string[];
  bodyType: string[];
  documents?: {
    docNr: string;
    index: number[];
  }[];
  renderAnnotationItem: (annotation: AnnoRepoAnnotation) => string;
  renderAnnotationItemContent: (annotation: AnnoRepoAnnotation) => JSX.Element;
  renderAnnotationLinks?: () => JSX.Element;
  renderAnnotationButtons: () => JSX.Element;
  createRouter: (
    comp1: React.ReactNode,
    comp2: React.ReactNode,
    errorComp: React.ReactNode
  ) => {
    path: string;
    element: React.ReactNode;
    errorElement: React.ReactNode;
  }[];
  renderHome: () => JSX.Element;
}
