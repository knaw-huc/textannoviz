import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/bootstrap4-light-blue/theme.css";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { Header } from "./components/Header";
import Help from "./components/Help";
import { Search } from "./components/Search/Search";
import { detailTier2Path } from "./components/Text/Annotated/project/utils/detailPath.ts";
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
import { getViteEnvVars } from "./utils/viteEnvVars.ts";

const { projectName, routerBasename, prodMode } = getViteEnvVars();

const { project, config } = await selectProjectConfig();

/**
 * Tailwind and project css loading:
 * - development:
 *   - vite dynamically imports project.css
 *   - tailwind css is processed with postcss using hot reloading
 * - production:
 *  - during build: merge project.css with tailwind.css
 *  - during build: generate a css file for every project
 *  - runtime: load the project-specific css file in {@link Layout}
 */
if (!prodMode) {
  await import("./tailwind.css");
  await import(`./projects/${project}/project.css`);
}

const router = await createRouter();

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
      {prodMode && (
        <link
          rel="stylesheet"
          href={`${import.meta.env.BASE_URL}/${projectName}.css`}
        />
      )}
      <Header />
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
            element: <Detail />,
          },
          {
            path: "help",
            element: <Help project={project} config={config} />,
          },
          ...config.routes.map((route) => ({
            path: route.path,
            element: route.element,
          })),
        ],
      },
    ],
    { basename: routerBasename ?? "/" },
  );
}

async function selectProjectConfig() {
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
    }
  } else {
    project = projectName;
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
