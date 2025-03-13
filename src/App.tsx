import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/bootstrap4-light-blue/theme.css";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { Header } from "./components/Header";
import Help from "./components/Help";
import { Search } from "./components/Search/Search";
import { detailTier2Path } from "./components/Text/Annotated/utils/detailPath.ts";
import { Detail } from "./Detail";
import { ErrorPage } from "./ErrorPage";
import { ExternalConfig } from "./model/ExternalConfig";
import { ProjectConfig } from "./model/ProjectConfig";
import { projectConfigs, ProjectName } from "./projects/projectConfigs.ts";
import { useAnnotationStore } from "./stores/annotation";
import {
  setProjectConfigSelector,
  setProjectNameSelector,
  useProjectStore,
} from "./stores/project";

const { project, config } = selectProjectConfig();
const router = await createRouter();

async function fetchExternalConfig(): Promise<ExternalConfig | null> {
  const basePath = (import.meta.env["VITE_ROUTER_BASENAME"] as string) ?? "/";
  const configUrl = `${
    basePath.endsWith("/") ? basePath : basePath + "/"
  }config`;

  const response = await fetch(configUrl);
  if (!response.ok) {
    return null;
  }

  return response.json();
}

if (import.meta.env.PROD && config.useExternalConfig === true) {
  const externalConfig = await fetchExternalConfig();

  if (externalConfig) {
    const {
      indexName,
      initialDateFrom,
      initialDateTo,
      initialRangeFrom,
      initialRangeTo,
      maxRange,
      broccoliUrl,
      annotationTypesToInclude,
    } = externalConfig;

    config.elasticIndexName = indexName;
    if (initialDateFrom) config.initialDateFrom = initialDateFrom;
    if (initialDateTo) config.initialDateTo = initialDateTo;
    if (initialRangeFrom) config.initialRangeFrom = initialRangeFrom;
    if (initialRangeTo) config.initialRangeTo = initialRangeTo;
    if (maxRange) config.maxRange = maxRange;
    if (broccoliUrl) config.broccoliUrl = broccoliUrl;
    if (annotationTypesToInclude)
      config.annotationTypesToInclude = annotationTypesToInclude;
  }
}

export default function App() {
  const setAnnotationTypesToInclude = useAnnotationStore(
    (state) => state.setAnnotationTypesToInclude,
  );
  const setAnnotationTypesToHighlight = useAnnotationStore(
    (state) => state.setAnnotationTypesToHighlight,
  );
  const setProjectConfig = useProjectStore(setProjectConfigSelector);
  const setProjectName = useProjectStore(setProjectNameSelector);
  setAnnotationTypesToInclude(config.annotationTypesToInclude);
  setAnnotationTypesToHighlight(config.annotationTypesToHighlight);

  setProjectConfig(config);
  setProjectName(project);

  return <RouterProvider router={router} />;
}

function Layout() {
  return (
    <>
      <style>{config.projectCss}</style>
      <Header projectConfig={config} />
      <Outlet />
    </>
  );
}

async function createRouter() {
  return createBrowserRouter(
    [
      {
        element: <Layout />,
        errorElement: <ErrorPage />,
        children: [
          {
            path: "/",
            element: <Search />,
          },
          {
            path: detailTier2Path,
            element: <Detail project={project} config={config} />,
          },
          {
            path: "help",
            element: <Help project={project} config={config} />,
          },
        ],
      },
    ],
    { basename: import.meta.env["VITE_ROUTER_BASENAME"] ?? "/" },
  );
}

function selectProjectConfig() {
  const projectEnvVar = "VITE_PROJECT";
  const project: ProjectName = import.meta.env[projectEnvVar];
  const config: ProjectConfig = projectConfigs[project];
  if (!config) {
    throw new Error(
      `No project config defined for ${projectEnvVar}=${project}`,
    );
  }
  return { project, config };
}
