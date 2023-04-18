import { AnnoRepoAnnotation } from "./AnnoRepoAnnotation";

export interface ProjectConfig {
  id: string;
  colours:
    | {
        [key: string]: string;
      }
    | undefined;
  relativeTo: string;
  annotationTypes: string[];
  annotationTypesToInclude: string[];
  tier: string[];
  bodyType: string[];
  scanAnnotation?: string;
  documents?: {
    docNr: string;
    index: number[];
  }[];
  letters?: string[];
  renderAnnotationItem: (annotation: AnnoRepoAnnotation) => string;
  renderAnnotationItemContent: (annotation: AnnoRepoAnnotation) => JSX.Element;
  renderAnnotationLinks?: () => JSX.Element;
  renderAnnotationButtons: () => JSX.Element;
  createRouter: (
    comp1: React.ReactNode,
    comp2: React.ReactNode,
    comp3: React.ReactNode,
    errorComp: React.ReactNode
  ) => {
    path: string;
    element: React.ReactNode;
    errorElement: React.ReactNode;
  }[];
  renderHome: () => JSX.Element;
}
