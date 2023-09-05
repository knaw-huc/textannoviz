import { AnnoRepoAnnotation } from "./AnnoRepoAnnotation";

export type ProjectConfig = {
  id: string;
  broccoliUrl: string;
  colours: Record<string, string>;
  relativeTo: string;
  annotationTypesToInclude: string[];
  annotationTypesTitles?: Record<string, string>;
  tier: string[];
  bodyType: string[];
  scanAnnotation?: string;
  documents?: {
    docNr: string;
    index: number[];
  }[];
  letters?: string[];
  elasticIndexName?: string;
  initialDateFrom?: string;
  initialDateTo?: string;
  searchFacetTitles?: Record<string, string>;
  textPanelTitles?: Record<string, string>;
  allPossibleTextPanels?: string[];
  defaultTextPanels?: string[];
  metadataPanelTitles?: Record<string, string>;
  facetsTranslation?: Record<string, string>;
  renderAnnotationItem: (annotation: AnnoRepoAnnotation) => string | undefined;
  renderAnnotationItemContent: (annotation: AnnoRepoAnnotation) => JSX.Element;
  renderAnnotationLinks?: () => JSX.Element;
  renderAnnotationButtons: (
    nextOrPrevButtonClicked: (clicked: boolean) => boolean,
  ) => JSX.Element;
  renderMetadataPanel: (annotations: AnnoRepoAnnotation[]) => JSX.Element;
  createRouter: (
    comp1: React.ReactNode,
    comp2: React.ReactNode,
    comp3: React.ReactNode,
    errorComp: React.ReactNode,
  ) => {
    path: string;
    element: React.ReactNode;
    errorElement: React.ReactNode;
  }[];
  renderHome: () => JSX.Element;
};
