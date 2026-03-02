import logoHuygens from "../../assets/logo-huygens-zwart.png";
import logoUu from "../../assets/logo-universiteit-utrecht.png";
import logoHuC from "../../assets/logo-knaw-humanities-cluster.png";
import logoKnaw from "../../assets/logo-knaw.svg";

export const SearchInfoPage = () => {
  return (
    <div className="border-brand1Grey-100 -mx-10 -mb-10 flex min-h-[50vh] -translate-y-16 border-b px-10 py-8">
      <div className="mx-auto flex w-full max-w-4xl items-center justify-center">
        <div className="flex max-w-3xl flex-col gap-4 text-justify">
          <h1 className="mb-1 text-left text-2xl xl:text-4xl">
            Dirk van Miert, Brontekst en context: <br />
            over data, editiewetenchap 2.0 en digitale infrastructuur.
          </h1>
          <p>
            Deze editie bevat de tekst van de oratie (inaugurele rede),
            uitgesproken op woensdag 4 maart, 16:15, in de aula van het
            Academiegebouw van de Universiteit Utrecht, door prof.dr. Dirk van
            Miert, bij de aanvaarding van de bijzondere leeropdracht
            “Kennisgeschiedenis vanuit Digitaal Perspectief” vanwege het Huygens
            Instituut voor Nederlandse Geschiedenis en Cultuur van de KNAW
            (Koninklijke Nederlandse Akademie van Wetenschappen).
          </p>
          <div className="md: flex flex-col flex-wrap gap-10 md:flex-row md:items-end">
            <img
              src={logoHuygens}
              className="w-32 md:h-10 md:w-auto"
              alt="logo Huygens Instituut"
            />
            <img
              src={logoUu}
              className="w-32 translate-y-2 md:h-12 md:w-auto"
              alt="logo Universiteit Utrecht"
            />
            <img
              src={logoHuC}
              className="w-24 translate-y-2 md:h-14 md:w-auto"
              alt="logo Knaw Humanities Cluster"
            />
            <img
              src={logoKnaw}
              className="w-24 md:h-12 md:w-auto"
              alt="logo Koninklijke Nederlandse Akademie van Wetenschappen"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
