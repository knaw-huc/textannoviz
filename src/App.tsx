import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/bootstrap4-light-blue/theme.css";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { Header } from "./components/Header";

import { detailPath } from "./components/Text/Annotated/utils/detailPath.ts";
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
import { lazy, Suspense } from "react";
import { SearchLoadingSpinner } from "./components/Search/SearchLoadingSpinner.tsx";

const Detail = lazy(() => import("./Detail"));
const Help = lazy(() => import("./components/Help"));
const Search = lazy(() => import("./components/Search/Search"));

const { project, config } = selectProjectConfig();
const router = await createRouter();

async function fetchExternalConfig(): Promise<ExternalConfig | null> {
  const response = await fetch("/config");
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

  return (
    <Suspense fallback={<SearchLoadingSpinner />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

function Layout() {
  return (
    <>
      <Header projectConfig={config} />
      <Outlet />
    </>
  );
}

async function createRouter() {
  return createBrowserRouter([
    {
      element: <Layout />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/",
          element: <Search />,
        },
        {
          path: detailPath,
          element: <Detail project={project} config={config} />,
        },
        {
          path: "help",
          element: <Help project={project} config={config} />,
        },
      ],
    },
  ]);
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
