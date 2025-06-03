import React from "react";
import { toast } from "react-toastify";
import { SearchQuery } from "../../model/Search";
import { encodeObject } from "../../utils/UrlParamUtils";
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { HelpIcon } from "../../components/common/icons/HelpIcon";

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
    async function initPersons() {
      const newPersons = await fetchPersons();
      if (!newPersons) return;

      newPersons.sort((a, b) =>
        a.displayLabel.localeCompare(b.displayLabel, "en", {
          sensitivity: "base",
          ignorePunctuation: true,
        }),
      );

      setPersons(newPersons);
    }

    initPersons();
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

  function moreInfoPerson(link: string) {
    //Some links look like "https://rkd.nl/artists/108502 http://vocab.getty.edu/ulan/500212765 https://www.wikidata.org/wiki/Q16867", so those are split on whitespace and then the first is opened in a new window
    const splitLink = link.split(" ");
    window.open(splitLink[0], "_blank");
  }

  return (
    <div
      style={{
        gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
      }}
      className="grid gap-6 p-2"
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
              {per.source ? (
                <span
                  className="flex cursor-pointer items-center"
                  onClick={() => moreInfoPerson(per.source!)}
                >
                  <HelpIcon />
                </span>
              ) : null}

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
  );
}

async function fetchPersons(): Promise<Person[] | null> {
  const response = await fetch(
    "https://preview.dev.diginfra.org/files/00000000000000000000000b/apparatus/bio-entities.json",
  );
  if (!response.ok) {
    const error = await response.json();
    toast(`${error.message}`, { type: "error" });
    return null;
  }
  return await response.json();
}
