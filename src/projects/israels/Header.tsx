import { getViteEnvVars } from "../../utils/viteEnvVars.ts";
import { LanguageMenu } from "../../components/LanguageMenu.tsx";
import {
  projectConfigSelector,
  translateProjectSelector,
  useProjectStore,
} from "../../stores/project.ts";
import { matchPath, useLocation } from "react-router-dom";
import { detailTier2Path } from "../../components/Text/Annotated/utils/detailPath.ts";
import { useAnnotationStore } from "../../stores/annotation.ts";
import { IsraelsTfLetterBody } from "../../model/AnnoRepoAnnotation.ts";

export const Header = () => {
  const projectConfig = useProjectStore(projectConfigSelector);
  const translateProject = useProjectStore(translateProjectSelector);
  const annotations = useAnnotationStore().annotations;

  const interfaceLang = projectConfig.defaultLanguage;

  const location = useLocation();

  const isOnDetailPage = !!matchPath(detailTier2Path, location.pathname);

  const { routerBasename } = getViteEnvVars();

  const introId = "urn:israels:file:intro";

  const letterAnno = annotations.find((anno) => anno.body.type === "tf:Letter");

  const letterTitle = letterAnno
    ? (letterAnno?.body as IsraelsTfLetterBody).metadata.title?.[interfaceLang]
    : translateProject("intro");

  return (
    <header className="grid grid-cols-[auto_auto_50px] grid-rows-[auto_auto] bg-[#dddddd] sm:grid-cols-[auto_auto_110px_50px] lg:grid-cols-[auto_auto_110px]">
      <div className="flex flex-col border-b border-neutral-400 px-6 py-2">
        <a
          title="Homepage"
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
            {translateProject("introHeader")}
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
        className={`col-span-3 flex items-center justify-center gap-2 border-b border-neutral-400 bg-white p-4 text-center sm:col-span-4 lg:col-span-3 ${
          !isOnDetailPage ? "hidden" : ""
        }`}
      >
        <h4>
          {letterTitle} <br className="md:hidden" />
        </h4>
        <div className="text-neutral-600">
          {letterAnno &&
            "(" + (letterAnno?.body as IsraelsTfLetterBody).metadata.file + ")"}
        </div>
      </div>
    </header>
  );
};
