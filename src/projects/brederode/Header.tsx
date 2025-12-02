import { firstLetterToUppercase } from "../../utils/firstLetterToUppercase.ts";
import { LanguageMenu } from "../../components/LanguageMenu.tsx";
import {
  projectConfigSelector,
  useProjectStore,
} from "../../stores/project.ts";
import { matchPath, useLocation, useNavigate } from "react-router-dom";
import { detailTier2Path } from "../../components/Text/Annotated/utils/detailPath.ts";
import { useAnnotationStore } from "../../stores/annotation.ts";
import { Button } from "react-aria-components";
import { LetterAnno } from "./annotation/ProjectAnnotationModel.ts";

export const Header = () => {
  const projectConfig = useProjectStore(projectConfigSelector);

  const location = useLocation();

  const navigate = useNavigate();

  const isOnDetailPage = !!matchPath(detailTier2Path, location.pathname);

  return (
    <header
      className={`grid grid-cols-[auto_auto_50px] grid-rows-[auto_auto] sm:grid-cols-[auto_auto_110px_50px] lg:grid-cols-[auto_auto_110px] ${projectConfig.headerColor}`}
    >
      <div className="flex w-fit flex-row gap-4 px-6 py-2">
        <Button onPress={() => navigate("/")}>
          <img src={projectConfig.logoImageUrl} className="h-12" alt="logo" />
        </Button>
        <Button
          className="hover:text-brand1-900 text-inherit no-underline hover:underline"
          onPress={() => navigate("/")}
        >
          {projectConfig.headerTitle}
        </Button>
      </div>
      <div className="flex items-center justify-end">
        <nav className="mr-4 hidden flex-row gap-4 *:no-underline lg:flex">
          <projectConfig.components.HelpLink />
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

  const letter = annotations.find((anno) => anno.body.type === "Letter");

  if (!letter) return null;
  return (
    <div className="col-span-3 flex items-center justify-center gap-2 border-b border-neutral-400 bg-white p-4 text-center text-black sm:col-span-4 lg:col-span-3">
      <div className="font-bold">{(letter.body as LetterAnno).title}</div>
    </div>
  );
};
