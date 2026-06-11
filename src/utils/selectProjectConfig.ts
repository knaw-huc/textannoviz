import { ExternalConfig } from "../model/ExternalConfig";
import { ProjectConfig } from "../model/ProjectConfig";
import { projectConfigs, ProjectName } from "../projects/projectConfigs.ts";
import { getViteEnvVars } from "./viteEnvVars.ts";

const { envProjectName, routerBasename, prodMode } = getViteEnvVars();

export async function selectProjectConfig() {
  let project: ProjectName | undefined = undefined;
  let config: ProjectConfig | undefined = undefined;

  if (prodMode) {
    const externalConfig = await fetchExternalConfig(routerBasename);

    if (externalConfig) {
      const {
        projectName: externalProjectName,
        indexName,
        siteTitle,
        initialDateFrom,
        initialDateTo,
        initialRangeFrom,
        initialRangeTo,
        maxRange,
        broccoliUrl,
        annotationTypesToInclude,
        showWebAnnoTab,
        personsUrl,
        artworksUrl,
        biblUrl,
        menuUrl,
        letterIdUrl,
        homeUrl,
      } = externalConfig;
      project = externalProjectName;
      config = projectConfigs[project];
      if (siteTitle) config.siteTitle = siteTitle;
      if (indexName) config.elasticIndexName = indexName;
      if (initialDateFrom) config.initialDateFrom = initialDateFrom;
      if (initialDateTo) config.initialDateTo = initialDateTo;
      if (initialRangeFrom) config.initialRangeFrom = initialRangeFrom;
      if (initialRangeTo) config.initialRangeTo = initialRangeTo;
      if (maxRange) config.maxRange = maxRange;
      if (broccoliUrl) config.broccoliUrl = broccoliUrl;
      if (annotationTypesToInclude)
        config.annotationTypesToInclude = annotationTypesToInclude;
      if (typeof showWebAnnoTab === "boolean") {
        config.showWebAnnoTab = showWebAnnoTab;
      }
      if (personsUrl) config.personsUrl = personsUrl;
      if (artworksUrl) config.artworksUrl = artworksUrl;
      if (biblUrl) config.biblUrl = biblUrl;
      if (menuUrl) config.menuUrl = menuUrl;
      if (letterIdUrl) config.letterIdUrl = letterIdUrl;
      if (homeUrl) config.homeUrl = homeUrl;
    }
  } else {
    project = envProjectName;
    config = projectConfigs[project];
  }

  if (!config || !project) {
    throw new Error(`No project config defined for ${project}`);
  }

  // Set head>title from project config
  document.title = config.siteTitle;

  return { project, config };
}

async function fetchExternalConfig(
  basePath: string,
): Promise<ExternalConfig | null> {
  const configUrl = `${
    basePath.endsWith("/") ? basePath : basePath + "/"
  }config`;

  const response = await fetch(configUrl);
  if (!response.ok) {
    return null;
  }

  return response.json();
}
