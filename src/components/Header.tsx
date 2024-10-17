import { ProjectConfig } from "../model/ProjectConfig";
import { LanguageMenu } from "./LanguageMenu.tsx";
import { HelpLink } from "./HelpLink.tsx";

type HeaderProps = {
  projectConfig: ProjectConfig;
};

export const Header = (props: HeaderProps) => {
  const { projectConfig } = props;

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
                href="/"
                className="hover:text-brand1-100 text-inherit no-underline hover:underline"
              >
                {projectConfig.headerTitle}
              </a>
            </span>
          </div>
        </div>
        {projectConfig.showHelpLink && <HelpLink />}
        <LanguageMenu />
      </div>
    </header>
  );
};
