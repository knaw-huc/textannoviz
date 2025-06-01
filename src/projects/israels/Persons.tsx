import React from "react";
import { toast } from "react-toastify";

type Person = {
  id: string;
  sex: string;
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

    fetchPersons().then((persons) => {
      if (!persons) return;
      persons.sort((a, b) =>
        a.displayLabel.localeCompare(b.displayLabel, "en", {
          sensitivity: "base",
          ignorePunctuation: true,
        }),
      );
      setPersons(persons);
    });
  }, []);

  console.log(persons);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
        gridGap: "1.5rem",
      }}
      className="p-2"
    >
      {persons?.map((per, index) => (
        <div className="max-w-[800px] rounded bg-neutral-50 p-5" key={index}>
          <div className="font-bold">{per.displayLabel}</div>
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
