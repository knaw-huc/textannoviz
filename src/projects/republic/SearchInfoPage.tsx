export const SearchInfoPage = () => {
  return (
    <div className="max-w-[900px] text-justify">
      <p className="mb-4 mt-4 block font-bold">Welkom bij Goetgevonden!</p>
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
