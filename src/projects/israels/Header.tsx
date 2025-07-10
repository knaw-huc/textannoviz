import { getViteEnvVars } from "../../utils/viteEnvVars.ts";
import { LanguageMenu } from "../../components/LanguageMenu.tsx";
import {
  projectConfigSelector,
  translateProjectSelector,
  useProjectStore,
} from "../../stores/project.ts";
import { useLocation } from "react-router-dom";

export const Header = () => {
  const projectConfig = useProjectStore(projectConfigSelector);
  const translateProject = useProjectStore(translateProjectSelector);
  const location = useLocation();

  const { routerBasename } = getViteEnvVars();

  const introId = "urn:israels:file:intro";

  return (
    <header className="grid grid-cols-[auto_auto_50px] grid-rows-[auto_auto] bg-[#dddddd] sm:grid-cols-[auto_auto_80px_50px] lg:grid-cols-[auto_auto_80px]">
      <div className="flex flex-col border-b border-neutral-400 px-6 py-2">
        <a
          title="Homepage"
          rel="noreferrer"
          target="_blank"
          href={routerBasename}
          className="flex flex-col text-inherit no-underline"
        >
          <span>De brieven van </span>
          <strong>Isaac Israëls</strong>
        </a>
      </div>
      <div className="flex items-center justify-end border-b border-neutral-400">
        <nav className="mr-4 hidden flex-row gap-4 text-sm *:no-underline lg:flex">
          <a
            rel="noreferrer"
            className="text-inherit no-underline hover:underline"
            href={`${
              routerBasename === "/" ? "" : routerBasename
            }/detail/${introId}`}
          >
            {translateProject("intro")}
          </a>
          {projectConfig.routes.map((route, index) => (
            <a
              rel="noreferrer"
              className="text-inherit no-underline hover:underline"
              href={`${routerBasename === "/" ? "" : routerBasename}/${
                route.path
              }`}
              key={index}
            >
              {translateProject(route.path)}
            </a>
          ))}
        </nav>
      </div>
      <div className="hidden items-center justify-center border-b border-neutral-400 sm:flex">
        <LanguageMenu />
      </div>
      {/* Hide <div> when not on detail page */}
      <div
        className={`col-span-3 flex items-center justify-center border-b border-neutral-400 bg-white p-4 text-center sm:col-span-4 lg:col-span-3 ${
          !location.pathname.includes("detail") ? "hidden" : ""
        }`}
      >
        <h4>
          REPLACE ME!
          <br className="md:hidden" />
          {/* <span className="text-sm font-normal text-neutral-600">
            <span className="mx-1 inline-block">—</span>
            brief 35
          </span> */}
        </h4>
      </div>
    </header>
  );
};
