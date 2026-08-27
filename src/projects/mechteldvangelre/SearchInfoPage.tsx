import { Button } from "react-aria-components";
import logoHuygens from "../../assets/logo-huygens.png";
import { useTranslateProject } from "../../stores/project";
import logoGeldersArchief from "../../assets/logo-gelders-archief.png";

export const SearchInfoPage = () => {
  const translateProject = useTranslateProject();

  function scrollToSearchResultsButtonHandler() {
    const target = document.getElementById("search-results");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <div className="border-brand1Grey-100 -mx-6 -mb-10 flex -translate-y-16 border-b bg-[#41b6e6] px-6 py-8 text-white lg:-mx-10 lg:px-10">
      <div className="mx-auto w-full max-w-4xl">
        <h1>Mechteld van Gelre: de briefcollectie</h1>
        <h2>Bezorgd door Roos in &apos;t Velt</h2>
        <p>
          Deze digitale editie bevat alle 189 brieven uit het archief van
          hertogin Mechteld van Gelre (ca. 1323-1384) die in het Gelders Archief
          bewaard worden. In alle opzichten is deze briefcollectie uniek: de
          hoeveelheid brieven, de ouderdom ervan, dat ze in de volkstaal
          geschreven zijn én rondom een vrouw in een machtspositie.
        </p>
        <br />
        <p>
          De brieven schetsen een veelzijdig beeld van Mechteld van Gelre, die
          tussen 1371 en 1379 een tevergeefse oorlog uitvocht om hertogin van
          Gelre te worden. Aan de ene kant was ze een zelfbewuste heerseres die
          op de hoogte moest zijn van militaire, politieke, economische en
          juridische ontwikkelingen in haar territoria; aan de andere kant was
          ze een luisterend oor voor de dagelijkse beslommeringen van haar
          familie, vriend(inn)en en bondgenoten.
        </p>
        <div className="my-8 flex max-w-3xl items-end justify-between">
          {/* Logos */}
          <div className="flex flex-col items-start gap-8 md:flex-row md:items-end">
            <div>
              <img src={logoGeldersArchief} className="h-14" alt="logo" />
            </div>
            <div>
              <img src={logoHuygens} className="h-14" alt="logo" />
            </div>
          </div>

          {/* Button */}
          <Button
            className="inline-flex items-center gap-2.5 rounded-md bg-[#333f48]
             px-5 py-3 text-[15px] font-semibold text-white outline-none
             transition-colors hover:bg-[#41505b]
             focus-visible:ring-2 focus-visible:ring-white/70"
            onPress={scrollToSearchResultsButtonHandler}
          >
            {translateProject("SCROLL_TO_LETTERS")}
            <span className="mt-px h-2 w-2 rotate-45 border-b-2 border-r-2 border-white/75" />
          </Button>
        </div>
      </div>
    </div>
  );
};
