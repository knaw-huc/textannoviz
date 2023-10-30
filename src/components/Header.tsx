import {ProjectConfig} from "../model/ProjectConfig";
import {LanguageMenu} from "./LanguageMenu.tsx";

type HeaderProps = {
  projectConfig: ProjectConfig;
};

export const Header = (props: HeaderProps) => {
  return (
    <header className="border-brand1-200 text-brand1-700 border-b">
      <div className="mx-auto flex w-full flex-row">
        <div className="flex flex-row items-center justify-start">
          <div className="bg-brand1-100 text-brand1-800 flex flex-row items-center justify-start gap-3 px-6 py-3">
            <div className="flex h-8 w-8 items-center justify-center">
              <a
                title="Homepage"
                rel="noreferrer"
                target="_blank"
                href={props.projectConfig.logoHref}
              >
                <img
                  src={props.projectConfig.logoImageUrl}
                  className="h-7 w-7"
                  alt="logo"
                />
              </a>
            </div>
            <span>
              <a
                title="Homepage"
                rel="noreferrer"
                href="/"
                className="hover:text-brand1-900 text-inherit no-underline hover:underline"
              >
                {props.projectConfig.headerTitle}
              </a>
            </span>
          </div>
        </div>
        <div className="ml-4 flex flex-row items-center justify-start gap-2">
          <a
            title="Help"
            rel="noreferrer"
            href={window.location.pathname === "/help" ? "/" : "/help"}
            className="hover:text-brand1-900 text-inherit no-underline hover:underline"
          >
            {window.location.pathname === "/help" ? "Search" : "Help"}
          </a>
        </div>
        <LanguageMenu />
      </div>
    </header>
  );
};
