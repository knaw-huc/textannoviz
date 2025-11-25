import { LanguageMenu } from "../../components/LanguageMenu.tsx";
import {
  projectConfigSelector,
  translateProjectSelector,
  useProjectStore,
} from "../../stores/project.ts";
import {
  matchPath,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { detailTier2Path } from "../../components/Text/Annotated/utils/detailPath.ts";
import { useAnnotationStore } from "../../stores/annotation.ts";
import { Button } from "react-aria-components";
import { findLetterBody } from "./annotation/ProjectAnnotationModel.ts";

export const Header = () => {
  const projectConfig = useProjectStore(projectConfigSelector);
  const translateProject = useProjectStore(translateProjectSelector);
  const annotations = useAnnotationStore().annotations;
  const params = useParams();
  const navigate = useNavigate();

  const interfaceLang = projectConfig.selectedLanguage;

  const location = useLocation();

  const isOnDetailPage = !!matchPath(detailTier2Path, location.pathname);

  const introId = "urn:mace:huc.knaw.nl:israels:intro";

  const letterAnnoBody = findLetterBody(annotations);

  const letterTitle =
    letterAnnoBody?.title?.[interfaceLang] ||
    (params.tier2 === introId && translateProject("intro"));

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
          <Button
            className="text-inherit no-underline hover:underline"
            onPress={() => navigate(`/detail/${introId}`)}
          >
            {translateProject("introHeader")}
          </Button>

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
          {letterTitle} <br className="md:hidden" />
        </h4>
        <div className="text-neutral-600">
          {letterAnnoBody && "(" + letterAnnoBody.n + ")"}
        </div>
      </div>
    </header>
  );
};
