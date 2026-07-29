import { ProjectName } from "../projects/projectConfigs";
import { LanguageCode } from "./Language";
import { ProjectConfig } from "./ProjectConfig";

export type ExternalConfig = {
  projectName: ProjectName;
  indexName: string;
  siteTitle?: string;
  initialDateFrom?: string;
  initialDateTo?: string;
  initialRangeFrom?: string;
  initialRangeTo?: string;
  maxRange?: number;
  broccoliUrl?: string;
  annotationTypesToInclude?: string[];
  showWebAnnoTab?: boolean;
  personsUrl?: string;
  artworksUrl?: ProjectConfig["artworksUrl"];
  biblUrl?: Partial<Record<LanguageCode, string>>;
  menuUrl: string;
  letterIdUrl: string;
  homeUrl: string;
  // Used to display the version of TAV
  version: string;
  // Is overwritten by the CI/CD pipeline to show that the deployment was successful
  versionHash: string;
};
