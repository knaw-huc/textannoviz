import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import { Header } from "./components/Header";
import Help from "./components/Help";
import { Search } from "./components/Search/Search";
import { detailTier2Path } from "./utils/detailPath.ts";
import { Detail } from "./Detail";
import { ErrorPage } from "./ErrorPage";
import { useAnnotationStore } from "./stores/annotation";
import {
  setProjectConfigSelector,
  setProjectNameSelector,
  useProjectStore,
} from "./stores/project";
import { selectProjectConfig } from "./utils/selectProjectConfig.ts";
import { getViteEnvVars } from "./utils/viteEnvVars.ts";

const { routerBasename, prodMode } = getViteEnvVars();

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
  await import(`./projects/${project}/project.css`).catch(() =>
    console.error(`No project.css found for ${project}`),
  );
}

const router = await createRouter();

export default function App() {
  const setAnnotationTypesToInclude = useAnnotationStore(
    (state) => state.setAnnotationTypesToInclude,
  );
  const setTextHighlightingTypes = useAnnotationStore(
    (state) => state.setTextHighlightingTypes,
  );
  const setProjectConfig = useProjectStore(setProjectConfigSelector);
  const setProjectName = useProjectStore(setProjectNameSelector);
  setAnnotationTypesToInclude(config.annotationTypesToInclude);
  setTextHighlightingTypes(config.textHighlightingTypes);

  setProjectConfig(config);
  setProjectName(project);

  return <RouterProvider router={router} />;
}

function Layout() {
  return (
    <div className="flex h-screen flex-col">
      {prodMode && (
        <link
          rel="stylesheet"
          href={`${
            routerBasename === "/" ? "" : routerBasename
          }/${project}.css`}
        />
      )}
      <Header />
      <Outlet />
    </div>
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
