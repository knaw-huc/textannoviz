import { Button } from "react-aria-components";
import logoHuygens from "../../assets/logo-huygens.png";
import {
  projectConfigSelector,
  useProjectStore,
  useTranslateProject,
} from "../../stores/project";
import React from "react";
import { handleAbort } from "../../utils/handleAbort";
import { fetchText } from "../../utils/fetchText";
import logoGeldersArchief from "../../assets/logo-gelders-archief.png";

export const SearchInfoPage = () => {
  const translateProject = useTranslateProject();
  const [content, setContent] = React.useState<string>();
  const homeUrl = useProjectStore(projectConfigSelector).homeUrl;

  function scrollToSearchResultsButtonHandler() {
    const target = document.getElementById("search-results");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  }

  React.useEffect(() => {
    const aborter = new AbortController();
    async function initHome(aborter: AbortController) {
      const newContent = await fetchText(homeUrl, aborter.signal);
      if (!newContent) return;

      setContent(newContent);
    }

    initHome(aborter).catch(handleAbort);

    return () => {
      aborter.abort();
    };
  }, []);

  return (
    <div className="border-brand1Grey-100 -mx-6 -mb-10 flex -translate-y-16 border-b bg-[#41b6e6] px-6 py-8 lg:-mx-10 lg:px-10">
      <div className="mx-auto w-full max-w-4xl">
        {(content?.length && (
          <div
            className="prose text-black"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )) || (
          <div>
            <h1>Placeholder</h1>
            <p>Nog meer placeholder</p>
            <p>Nog meer placeholder</p>
            <p>Nog meer placeholder</p>
            <p>Nog meer placeholder</p>
            <p>Nog meer placeholder</p>
            <p>Nog meer placeholder</p>
            <p>Nog meer placeholder</p>
            <p>Nog meer placeholder</p>
          </div>
        )}

        <div className="my-8 flex max-w-3xl items-start justify-between md:items-end">
          {/* Logos */}
          <div className="flex flex-col gap-8 md:flex-row md:items-end">
            <div>
              <img src={logoGeldersArchief} className="h-14" alt="logo" />
            </div>
            <div>
              <img src={logoHuygens} className="h-14" alt="logo" />
            </div>
          </div>

          {/* Button */}
          <Button
            className="bg-brand1-200 rounded p-2 outline-none"
            onPress={scrollToSearchResultsButtonHandler}
          >
            {translateProject("SCROLL_TO_LETTERS")} {String.fromCharCode(9663)}
          </Button>
        </div>
      </div>
    </div>
  );
};
