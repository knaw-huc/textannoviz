import { useLayoutEffect } from "react";
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  useHref,
  useLocation,
  useNavigate,
  useParams,
} from "react-router";
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
import { RouterProvider as AriaRouterProvider } from "react-aria-components";

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

/**
 * React Aria resolves every Link href through this hook, including absolute ones. React Router's `useHref` would resolve those as relative paths, so external URLs are passed through untouched.
 */
function useHrefAllowingExternal(href: string) {
  const resolved = useHref(href);
  return URL.canParse(href) ? href : resolved;
}

function toPageId(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function Layout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { tier2 } = useParams();

  // Detail routes share `/detail/:tier2`; use the document id (last URN segment)
  // so pages like chronology / introI get unique CSS hooks.
  const pageId = (() => {
    if (pathname === "/") return "search";
    if (tier2) {
      const documentId = tier2.includes(":")
        ? (tier2.split(":").at(-1) ?? tier2)
        : tier2;
      return toPageId(documentId) || "detail";
    }
    return toPageId(pathname.slice(1).split("/")[0] ?? "unknown") || "unknown";
  })();

  // Put the page id on the real mount root (`#container` in index.html), so
  // DevTools / CSS see a unique id instead of the static "container".
  useLayoutEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-app-root]");
    if (!root) return;

    root.id = `page-${pageId}`;
    for (const className of [...root.classList]) {
      if (className.startsWith("page-")) root.classList.remove(className);
    }
    root.classList.add(`page-${pageId}`);
  }, [pageId]);

  return (
    <AriaRouterProvider navigate={navigate} useHref={useHrefAllowingExternal}>
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
    </AriaRouterProvider>
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
