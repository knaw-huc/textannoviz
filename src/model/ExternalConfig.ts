import { ProjectName } from "../projects/projectConfigs";
import { LanguageCode } from "./Language";

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
  personsUrl?: string;
  artworksUrl?: string;
  biblUrl?: Partial<Record<LanguageCode, string>>;
};
