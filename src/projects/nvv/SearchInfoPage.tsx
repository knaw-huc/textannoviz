import { Button } from "react-aria-components";
import logoIISG from "../../assets/logo-iisg.png";
import {
  projectConfigSelector,
  useProjectStore,
  useTranslateProject,
} from "../../stores/project";

export const SearchInfoPage = () => {
  const translateProject = useTranslateProject();
  const projectConfig = useProjectStore(projectConfigSelector);

  function scrollToSearchResultsButtonHandler() {
    const target = document.getElementById("search-results");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  }
  return (
    <div className="border-brand1Grey-100 -mx-6 -mb-10 flex -translate-y-16 border-b bg-[#417CBA] px-6 py-8 lg:-mx-10 lg:px-10">
      <div className="mx-auto w-full max-w-4xl">
        <h1>{translateProject("INFO_TITLE")}</h1>

        <h2>{translateProject("EDITED_BY")}</h2>

        <div className="flex max-w-3xl flex-col gap-6 text-justify">
          <p>Archieven van Nederlands Verbond van Vakverenigingen</p>
          <p>© 2026 IISG, Amsterdam</p>
          <p className="italic">Last updated: {projectConfig.lastUpdated}</p>
        </div>

        <div className="my-8 flex max-w-3xl items-start justify-between md:items-end">
          {/* Logos */}
          <div className="flex flex-col gap-8 md:flex-row md:items-end">
            <div>
              <img src={logoIISG} className="h-14" alt="logo" />
            </div>
          </div>

          {/* Button */}
          <Button
            className="rounded bg-blue-500 p-2 outline-none"
            onPress={scrollToSearchResultsButtonHandler}
          >
            {translateProject("SCROLL_TO_LETTERS")} {String.fromCharCode(9663)}
          </Button>
        </div>
      </div>
    </div>
  );
};
