import { Button } from "react-aria-components";
import logoHuygens from "../../assets/logo-huygens.png";
import logoVG from "../../assets/logo-vg.svg";
import logoVGM from "../../assets/logo-vgm.png";
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
    <div className="bg-white -mx-10 -mb-10 -translate-y-16">
      <div className="flex flex-col bg-[#2f72cb] w-[calc(100%-30px)] py-8 px-6">
        <div className="flex justify-end">
          <img
            src={logoVG}
            className="h-16 translate-x-[36px] md:translate-y-20"
            alt="Vincent van Gogh: The Letters"
          />
        </div>

      <div className="mx-auto w-full max-w-2xl">




      <div className="prose text-white prose-headings:text-white prose-a:text-white prose-width:max-w-2xl">
        <div className="about">

                <h1>Vincent van Gogh<br /> The Letters</h1>

                <h2>Edited by Leo Jansen, Hans Luijten and
                    Nienke Bakker</h2>

                <p>Vincent van Gogh's letters offer a unique window into the
                    artist's universe. This complete edition contains all surviving letters
                    exchanged between Van Gogh and his brother <a href="?query[terms][correspondentId][]=vg_421">Theo</a>, artist friends such as <a href="?query[terms][correspondentId][]=vg_1039">Paul Gauguin</a> and <a href="?query[terms][correspondentId][]=vg_831">Emile Bernard</a>, and many
                    others.</p>

                <p>The letters are presented in their original language, fully
                    annotated and illustrated, and accompanied by authorised English
                    translations.</p>

                <p>This digital edition and the printed editions in English,
                    Dutch and French were published in 2009. They stem from a joint research project
                    by the Van Gogh Museum and the Huygens Institute.</p>

                <p>The digital edition has been updated several times since. The
                    editors will continue to add new findings as they become available.</p>

                <p>© 2026 Van Gogh Museum, Amsterdam</p>
            </div></div>

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
            className="rounded border border-black bg-[#ddd3af] p-2 text-black outline-none"
            onPress={scrollToSearchResultsButtonHandler}
          >
            {translateProject("SCROLL_TO_LETTERS")} {String.fromCharCode(9663)}
          </Button>
        </div>
      </div>
    </div>
    </div>
  );
};
