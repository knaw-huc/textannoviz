import { firstLetterToUppercase } from "../../utils/firstLetterToUppercase.ts";
import { LanguageMenu } from "../../components/LanguageMenu.tsx";
import {
  projectConfigSelector,
  useProjectStore,
} from "../../stores/project.ts";
import { useNavigate } from "react-router-dom";
import { Button } from "react-aria-components";

export const Header = () => {
  const projectConfig = useProjectStore(projectConfigSelector);

  const navigate = useNavigate();

  return (
    <header className={projectConfig.headerColor}>
      <div className="mx-auto flex w-full flex-row">
        <div className="flex flex-row items-center justify-start">
          <div className="flex flex-row items-center justify-start gap-3 px-6 py-3">
            <div className="flex h-12 items-center justify-center">
              <Button onPress={() => navigate(projectConfig.logoHref)}>
                {" "}
                <img
                  src={projectConfig.logoImageUrl}
                  className="h-12"
                  alt="logo"
                />
              </Button>
            </div>
            <Button
              className="hover:text-brand1-900 text-inherit no-underline hover:underline"
              onPress={() => navigate("/")}
            >
              {projectConfig.headerTitle}
            </Button>
          </div>
        </div>
        <projectConfig.components.HelpLink />
        <div className="flex grow flex-row items-center justify-end gap-4 pr-4">
          {projectConfig.routes.map((route, index) => (
            <nav key={index} className="flex flex-row items-center">
              <Button
                className="text-inherit no-underline hover:underline"
                onPress={() => navigate(`/${route.path}`)}
              >
                {firstLetterToUppercase(route.path)}
              </Button>
            </nav>
          ))}
        </div>

        <LanguageMenu />
      </div>
    </header>
  );
};
