import { AnnoRepoAnnotation } from "./AnnoRepoAnnotation";

export interface ProjectConfig {
  id: string;
  colours: {
    [key: string]: string;
  };
  relativeTo: string;
  annotationTypesToInclude: string[];
  broccoliVersion: string;
  tier: string[];
  bodyType: string[];
  renderAnnotationItem?: (annotation: AnnoRepoAnnotation) => string;
}
