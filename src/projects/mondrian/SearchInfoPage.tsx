import { Button } from "react-aria-components";
import logoHuygens from "../../assets/logo-huygens.png";
import logoRKD from "../../assets/logo-rkd.png";
import {
  projectConfigSelector,
  useProjectStore,
  useTranslateProject,
} from "../../stores/project";
import React from "react";
import { fetchText } from "../../utils/fetchText";
import { handleAbort } from "../../utils/handleAbort";

export const SearchInfoPage = () => {
  const translateProject = useTranslateProject();
  const [content, setContent] = React.useState<string>();
  const { homeUrl } = useProjectStore(projectConfigSelector);

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
    <div className="border-brand1Grey-100 -mx-6 -mb-10 flex -translate-y-16 border-b bg-[#dcc393] px-6 py-8 lg:-mx-10 lg:px-10">
      <div className="mx-auto w-full max-w-4xl">
        {content && (
          <div
            className="prose text-black"
            dangerouslySetInnerHTML={{ __html: content }}
          ></div>
        )}

        <div className="my-8 flex max-w-3xl items-start justify-between md:items-end">
          {/* Logos */}
          <div className="flex flex-col gap-8 md:flex-row md:items-end">
            {/* <div>
              <img src={logoVGM} className="h-20" alt="logo" />
            </div> */}
            <div>
              <img src={logoRKD} className="h-32" alt="Logo RKD" />
            </div>
            <div>
              <img
                src={logoHuygens}
                className="h-14"
                alt="Logo Huygens Institute"
              />
            </div>
          </div>

          {/* Button */}
          <Button
            className="rounded border border-neutral-600 bg-[#e6d7ba] p-2 outline-none focus-visible:ring-2 focus-visible:ring-neutral-800 focus-visible:ring-offset-2"
            onPress={scrollToSearchResultsButtonHandler}
          >
            {translateProject("SCROLL_TO_LETTERS")} {String.fromCharCode(9663)}
          </Button>
        </div>
      </div>
    </div>
  );
};
