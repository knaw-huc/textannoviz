import { ProjectConfig } from "../model/ProjectConfig";
import { LanguageMenu } from "./LanguageMenu.tsx";

type HeaderProps = {
  projectConfig: ProjectConfig;
};

export const Header = (props: HeaderProps) => {
  return (
    <header className={props.projectConfig.headerColor}>
      <div className="mx-auto flex w-full flex-row">
        <div className="flex flex-row items-center justify-start">
          <div className="flex flex-row items-center justify-start gap-3 px-6 py-3">
            <div className="flex h-12 items-center justify-center">
              <a
                title="Homepage"
                rel="noreferrer"
                target="_blank"
                href={props.projectConfig.logoHref}
              >
                <img
                  src={props.projectConfig.logoImageUrl}
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
                {props.projectConfig.headerTitle}
              </a>
            </span>
          </div>
        </div>
        <div className="mr-4 flex grow flex-row items-center justify-end gap-2">
          <a
            title="Help"
            rel="noreferrer"
            href={window.location.pathname === "/help" ? "/" : "/help"}
            className="hover:text-brand1-100 text-inherit no-underline hover:underline"
          >
            {window.location.pathname === "/help" ? "Search" : "Help"}
          </a>
        </div>
        <LanguageMenu />
      </div>
    </header>
  );
};
