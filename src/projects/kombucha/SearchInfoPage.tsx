import { Button } from "react-aria-components";
import logoHuygens from "../../assets/logo-huygens.png";
import logoVGM from "../../assets/logo-vgm.png";
import logoRKD from "../../assets/logo-rkd.png";
import { useTranslateProject } from "../../stores/project";

export const SearchInfoPage = () => {
  const translateProject = useTranslateProject();

  function scrollToSearchResultsButtonHandler() {
    const target = document.getElementById("search-results");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <div className="border-brand1Grey-100 -mx-6 -mb-10 flex -translate-y-16 border-b bg-neutral-100 px-6 py-8 lg:-mx-10 lg:px-10">
      <div className="mx-auto w-full max-w-4xl">
        <h1>Artists&apos; Letters: Combined Edition</h1>

        <div className="my-8 flex max-w-3xl items-start justify-between md:items-end">
          {/* Logos */}
          <div className="flex flex-col gap-8 md:flex-row md:items-end">
            <div>
              <img src={logoVGM} className="h-20" alt="logo" />
            </div>
            <div>
              <img src={logoRKD} className="h-20" alt="Logo RKD" />
            </div>
            <div>
              <img src={logoHuygens} className="h-14" alt="logo" />
            </div>
          </div>

          {/* Button */}
          <Button
            className="rounded bg-neutral-200 p-2 outline-none hover:bg-neutral-300"
            onPress={scrollToSearchResultsButtonHandler}
          >
            {translateProject("SCROLL_TO_LETTERS")} {String.fromCharCode(9663)}
          </Button>
        </div>
      </div>
    </div>
  );
};
