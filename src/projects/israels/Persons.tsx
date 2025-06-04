import React from "react";
import { toast } from "react-toastify";
import { SearchQuery } from "../../model/Search";
import { encodeObject } from "../../utils/UrlParamUtils";
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { HelpIcon } from "../../components/common/icons/HelpIcon";
import { handleAbort } from "../../utils/handleAbort";

type Person = {
  id: string;
  sex: string;
  source?: string;
  persName: {
    full: string;
    forename: string;
    addName?: string;
    surname:
      | string[]
      | {
          type: string;
          text: string;
        };
    nameLink?: string;
  }[];
  birth: {
    when?: string;
    cert?: string;
  };
  death: {
    when?: string;
    cert?: string;
    notBefore?: string;
  };
  displayLabel: string;
  sortLabel: string;
};

export function Persons() {
  const [persons, setPersons] = React.useState<Person[]>();

  React.useEffect(() => {
    const aborter = new AbortController();
    async function initPersons(aborter: AbortController) {
      const newPersons = await fetchPersons(aborter.signal);
      if (!newPersons) return;

      newPersons.sort((a, b) =>
        a.displayLabel.localeCompare(b.displayLabel, "en", {
          sensitivity: "base",
          ignorePunctuation: true,
        }),
      );

      setPersons(newPersons);
    }

    initPersons(aborter).catch(handleAbort);

    return () => {
      aborter.abort();
    };
  }, []);

  function searchPerson(per: Person) {
    const query: Partial<SearchQuery> = {
      terms: {
        persons: [per.sortLabel],
      },
    };

    const encodedQuery = encodeObject({ query: query });
    window.open(`/?${encodedQuery}`, "_blank");
  }

  return (
    <>
      <h1 className="pl-8">Persons</h1>
      <div
        style={{
          gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
        }}
        className="grid gap-6 px-8 pb-8"
      >
        {persons?.map((per, index) => (
          <div
            className="h-36 max-w-[800px] rounded bg-neutral-50 p-5"
            key={index}
          >
            <div className="flex flex-row items-center">
              <div className="flex w-fit flex-grow flex-row items-center justify-start font-bold">
                {per.displayLabel}
              </div>
              {/* TODO: SVG wordt kleiner wanneer `displayLabel` langer is dan 1 regel */}
              <div className="flex flex-row items-center justify-end gap-1">
                {per.source
                  ? per.source.split(" ").map((src, index) => (
                      <span
                        className="flex cursor-pointer items-center"
                        onClick={() => window.open(src, "_blank")}
                        key={index}
                      >
                        <HelpIcon />
                      </span>
                    ))
                  : null}

                <MagnifyingGlassIcon
                  aria-hidden
                  className="h-4 w-4 cursor-pointer"
                  onClick={() => searchPerson(per)}
                />
              </div>
            </div>
            <div>
              {/* TODO: deze elementen nog beter stylen. Onzekerheid beter weergeven, net als de `notBefore`. */}
              {per.birth?.when || per.birth?.cert}-
              {per.death?.when || per.death?.cert || per.death?.notBefore}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

//TODO: generiek maken om zowel personen als kunstwerken aan te kunnen. URL verhuizen naar project config en deze dan aan de functie meegeven?
async function fetchPersons(signal: AbortSignal): Promise<Person[] | null> {
  const response = await fetch(
    "https://preview.dev.diginfra.org/files/00000000000000000000000b/apparatus/bio-entities.json",
    { signal },
  );
  if (!response.ok) {
    const error = await response.json();
    toast(`${error.message}`, { type: "error" });
    return null;
  }
  return await response.json();
}
