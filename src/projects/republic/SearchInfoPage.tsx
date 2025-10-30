import { projectConfigSelector, useProjectStore } from "../../stores/project";

export const SearchInfoPage = () => {
  const interfaceLang = useProjectStore(projectConfigSelector).selectedLanguage;

  return (
    <div className="max-w-[900px] text-justify">
      {interfaceLang === "nl" ? <DutchSearchInfo /> : <EnglishSearchInfo />}
    </div>
  );
};

const DutchSearchInfo = () => {
  return (
    <div>
      <p className="mb-4 block font-bold">Welkom bij Goetgevonden!</p>
      <p className="mb-4 mt-4 block">
        Met deze webapplicatie kun je zoeken in de resoluties van de
        Staten-Generaal van de Republiek der Zeven Verenigde Nederlanden
        (1576-1796). Bekijk onze{" "}
        <a target="_blank" href="https://goetgevonden.nl" rel="noreferrer">
          homepage
        </a>{" "}
        voor meer informatie over Goetgevonden.
      </p>
      <p className="mb-4 mt-4 block">
        De resoluties zijn geschreven in historisch Nederlands. Het taalgebruik
        was toen anders dan vandaag. Bovendien bestond er in de tijd van de
        Republiek geen standaardspelling.
      </p>
      <p className="mb-4 mt-4 block">
        Maak daarom in het ‘vrij zoeken’-veld gebruik van{" "}
        <a
          target="_blank"
          href="https://goetgevonden.nl/help/gebruik-van-de-applicatie/vrij-zoeken-in-de-tekst"
          rel="noreferrer"
        >
          wildcards
        </a>
        . Op deze manier krijg je zo veel mogelijk zoekresultaten.
      </p>
      <p className="mb-4 mt-4 block">
        Je kunt de zoekresultaten verfijnen met verschillende filteropties. Meer
        informatie over deze filters vind je achter de infoknoppen en in{" "}
        <a
          target="_blank"
          href="https://goetgevonden.nl/help/gebruik-van-de-applicatie"
          rel="noreferrer"
        >
          deze toelichting
        </a>
        .
      </p>
      <p className="mb-4 mt-4 block">
        Hulp nodig tijdens het zoeken? Gebruik de helpknop rechtsboven.
      </p>
    </div>
  );
};

const EnglishSearchInfo = () => {
  return (
    <div>
      <p className="mb-4 block font-bold">Welcome to Goetgevonden!</p>
      <p className="mb-4 mt-4 block">
        With this web application, you can search the resolutions of the States
        General of the Republic of the Seven United Netherlands (1576–1796).
        Visit our{" "}
        <a target="_blank" href="https://goetgevonden.nl/en/" rel="noreferrer">
          homepage
        </a>{" "}
        for more information about Goetgevonden.
      </p>
      <p className="mb-4 mt-4 block">
        The resolutions are written in historical Dutch. The language used at
        the time was different from modern Dutch, and there was no standardised
        spelling in the Dutch Republic.
      </p>
      <p className="mb-4 mt-4 block">
        Therefore, when using the &apos;free search&apos; field, make us of{" "}
        <a
          target="_blank"
          href="https://goetgevonden.nl/en/using-the-application/free-search-in-the-text/"
          rel="noreferrer"
        >
          wildcards
        </a>{" "}
        to obtain as many search results as possible.
      </p>
      <p className="mb-4 mt-4 block">
        You can refine your search results using various filter options. More
        information about these filters can be found via the information buttons
        and in this{" "}
        <a
          target="_blank"
          href="https://goetgevonden.nl/en/using-the-application/"
          rel="noreferrer"
        >
          explanatory guide
        </a>
        .
      </p>
      <p className="mb-4 mt-4 block">
        Need help while searching? Use the help button in the top right corner.
      </p>
    </div>
  );
};
