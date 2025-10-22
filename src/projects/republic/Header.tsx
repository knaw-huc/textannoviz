import { firstLetterToUppercase } from "../../utils/firstLetterToUppercase.ts";
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
import { ResolutionBody } from "../../model/AnnoRepoAnnotation.ts";
import { monthNumberToString } from "../../utils/monthNumberToString.ts";

export const Header = () => {
  const projectConfig = useProjectStore(projectConfigSelector);

  const { routerBasename } = getViteEnvVars();

  const location = useLocation();

  const isOnDetailPage = !!matchPath(detailTier2Path, location.pathname);

  return (
    <header
      className={`grid grid-cols-[auto_auto_50px] grid-rows-[auto_auto] sm:grid-cols-[auto_auto_110px_50px] lg:grid-cols-[auto_auto_110px] ${projectConfig.headerColor}`}
    >
      <div className="flex flex-col px-6 py-2">
        <a
          title="Homepage"
          rel="noreferrer"
          target="_blank"
          href={projectConfig.logoHref}
        >
          <img src={projectConfig.logoImageUrl} className="h-12" alt="logo" />
        </a>
      </div>
      <div className="flex items-center justify-end">
        <nav className="mr-4 hidden flex-row gap-4 *:no-underline lg:flex">
          <projectConfig.components.HelpLink />
          {projectConfig.routes.map((route, index) => (
            <nav key={index} className="flex flex-row items-center">
              <a
                rel="noreferrer"
                className="text-inherit no-underline hover:underline"
                href={`${routerBasename === "/" ? "" : routerBasename}/${
                  route.path
                }`}
              >
                {firstLetterToUppercase(route.path)}
              </a>
            </nav>
          ))}
        </nav>
      </div>

      <div className="hidden items-center justify-center sm:flex">
        <LanguageMenu />
      </div>
      {isOnDetailPage ? <DetailPageInfoHeader /> : null}
    </header>
  );
};

const DetailPageInfoHeader = () => {
  const annotations = useAnnotationStore((s) => s.annotations);
  const translateProject = useProjectStore(translateProjectSelector);

  const resolution = annotations.find(
    (anno) => anno.body.type === "Resolution",
  );

  if (!resolution) return null;
  return (
    <div className="col-span-3 flex items-center justify-center gap-2 border-b border-neutral-400 bg-white p-4 text-center text-black sm:col-span-4 lg:col-span-3">
      <div className="font-bold">
        {" "}
        {translateProject(
          (resolution.body as ResolutionBody)?.metadata.sessionWeekday,
        )}{" "}
        {(resolution.body as ResolutionBody).metadata.sessionDay}{" "}
        {
          monthNumberToString[
            (resolution.body as ResolutionBody).metadata.sessionMonth
          ]
        }{" "}
        {(resolution.body as ResolutionBody).metadata.sessionYear}
      </div>
    </div>
  );
};
