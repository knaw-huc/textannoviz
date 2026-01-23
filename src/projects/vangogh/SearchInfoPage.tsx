import { Button } from "react-aria-components";
import logoHuygens from "../../assets/logo-huygens.png";
import logoVGM from "../../assets/logo-vgm.png";
import {
  translateProjectSelector,
  useProjectStore,
} from "../../stores/project";

export const SearchInfoPage = () => {
  const translateProject = useProjectStore(translateProjectSelector);

  function scrollToSearchResultsButtonHandler() {
    const target = document.getElementById("search-results");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <div className="border-brand1Grey-100 -mx-10 -mb-10 flex -translate-y-16 border-b bg-[#FFCE01] px-10 py-8">
      <div className="mx-auto w-full max-w-4xl">
        <h1>{translateProject("INFO_TITLE")}</h1>

        <h2>{translateProject("EDITED_BY")}</h2>

        <div className="flex max-w-3xl flex-col gap-6 text-justify">
          <p>{translateProject("P1")}</p>
          <p>{translateProject("P2")}</p>
          <p>© 2026 Van Gogh Museum, Amsterdam</p>
        </div>

        <div className="my-8 flex max-w-3xl items-start justify-between md:items-end">
          {/* Logos */}
          <div className="flex flex-col gap-8 md:flex-row md:items-end">
            <div>
              <img src={logoVGM} className="h-20" alt="logo" />
            </div>
            <div>
              <img src={logoHuygens} className="h-14" alt="logo" />
            </div>
          </div>

          {/* Button */}
          <Button
            className="rounded bg-yellow-500 p-2 outline-none"
            onPress={scrollToSearchResultsButtonHandler}
          >
            {translateProject("SCROLL_TO_LETTERS")} {String.fromCharCode(9663)}
          </Button>
        </div>
      </div>
    </div>
  );
};
