import { LanguageMenu } from "../../components/LanguageMenu.tsx";
import {
  projectConfigSelector,
  translateProjectSelector,
  useProjectStore,
} from "../../stores/project.ts";
import { matchPath, useLocation, useNavigate } from "react-router-dom";
import { detailTier2Path } from "../../components/Text/Annotated/utils/detailPath.ts";
import { Button } from "react-aria-components";

type HeaderProps = {
  introIds: { name: string; id: string }[];
  letterTitle: string;
  letterNumber: string | undefined;
};

export const Header = (props: HeaderProps) => {
  const projectConfig = useProjectStore(projectConfigSelector);
  const translateProject = useProjectStore(translateProjectSelector);
  const navigate = useNavigate();
  const location = useLocation();

  const isOnDetailPage = !!matchPath(detailTier2Path, location.pathname);

  return (
    <header className="grid grid-cols-[auto_auto_50px] grid-rows-[auto_auto] bg-[#dddddd] sm:grid-cols-[auto_auto_110px_50px] lg:grid-cols-[auto_auto_110px]">
      <div className="flex flex-col border-b border-neutral-400 px-6 py-2">
        <Button
          className="flex w-fit flex-col items-start text-inherit no-underline hover:underline"
          onPress={() => navigate("/")}
        >
          <strong>{translateProject("TITLE_PT_1")}</strong>
          <strong>{translateProject("TITLE_PT_2")}</strong>
        </Button>
      </div>
      <div className="flex items-center justify-end border-b border-neutral-400">
        <nav className="mr-4 hidden flex-row gap-4 text-sm *:no-underline lg:flex">
          {props.introIds.map((introId) => (
            <Button
              key={introId.id}
              className="text-inherit no-underline hover:underline"
              onPress={() => navigate(`/detail/${introId.id}`)}
            >
              {introId.name}
            </Button>
          ))}

          {projectConfig.routes.map((route, index) => (
            <Button
              key={index}
              className="text-inherit no-underline hover:underline"
              onPress={() => navigate(`/${route.path}`)}
            >
              {translateProject(route.path)}
            </Button>
          ))}
          <Button
            className="text-inherit no-underline hover:underline"
            onPress={() => navigate("/help")}
          >
            {translateProject("help")}
          </Button>
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
          {props.letterTitle} <br className="md:hidden" />
        </h4>
        <div className="text-neutral-600">
          {props.letterNumber && "(" + props.letterNumber + ")"}
        </div>
      </div>
    </header>
  );
};
