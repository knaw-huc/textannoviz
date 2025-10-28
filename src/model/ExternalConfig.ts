import { ProjectName } from "../projects/projectConfigs";

export type ExternalConfig = {
  projectName: ProjectName;
  indexName: string;
  initialDateFrom?: string;
  initialDateTo?: string;
  initialRangeFrom?: string;
  initialRangeTo?: string;
  maxRange?: number;
  broccoliUrl?: string;
  annotationTypesToInclude?: string[];
  showWebAnnoTab?: boolean;
};
