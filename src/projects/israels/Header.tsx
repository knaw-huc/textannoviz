import { getViteEnvVars } from "../../utils/viteEnvVars.ts";
import { LanguageMenu } from "../../components/LanguageMenu.tsx";
import {
  projectConfigSelector,
  translateProjectSelector,
  useProjectStore,
} from "../../stores/project.ts";

export const Header = () => {
  const projectConfig = useProjectStore(projectConfigSelector);
  const translateProject = useProjectStore(translateProjectSelector);

  const { routerBasename } = getViteEnvVars();

  const introId = "urn:israels:file:intro";

  return (
    <header className={projectConfig.headerColor}>
      <div className="mx-auto flex w-full flex-row">
        <div className="flex flex-row items-center justify-start">
          <div className="flex flex-row items-center justify-start gap-3 px-6 py-3">
            <div className="flex h-12 items-center justify-center">
              <a
                title="Homepage"
                rel="noreferrer"
                target="_blank"
                href={projectConfig.logoHref}
              >
                <img
                  src={projectConfig.logoImageUrl}
                  className="h-12"
                  alt="logo"
                />
              </a>
            </div>
            <span>
              <a
                title="Homepage"
                rel="noreferrer"
                href={routerBasename}
                className="hover:text-brand1-900 text-inherit no-underline hover:underline"
              >
                {projectConfig.headerTitle}
              </a>
            </span>
          </div>
        </div>
        <projectConfig.components.HelpLink />
        <div className="flex grow flex-row items-center justify-end gap-4 pr-4">
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
            <nav key={index} className="flex flex-row items-center">
              <a
                rel="noreferrer"
                className="text-inherit no-underline hover:underline"
                href={`${routerBasename === "/" ? "" : routerBasename}/${
                  route.path
                }`}
              >
                {translateProject(route.path)}
              </a>
            </nav>
          ))}
        </div>

        <LanguageMenu />
      </div>
    </header>
  );
};
