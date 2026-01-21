import React from "react";
import { toast } from "../../utils/toast.ts";
import { SearchQuery } from "../../model/Search";
import { encodeObject } from "../../utils/UrlParamUtils";
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { HelpIcon } from "../../components/common/icons/HelpIcon";
import { handleAbort } from "../../utils/handleAbort";
import {
  PersonLifespan,
  type Person,
} from "./annotation/ProjectAnnotationModel";
import { getViteEnvVars } from "../../utils/viteEnvVars";
import {
  projectConfigSelector,
  translateProjectSelector,
  useProjectStore,
} from "../../stores/project";
import { Button } from "react-aria-components";

export function Persons() {
  const [persons, setPersons] = React.useState<Person[]>();
  const personRefs = React.useRef<Record<string, HTMLDivElement | null>>({});
  const { israelsPersonsUrl, routerBasename } = getViteEnvVars();
  const translateProject = useProjectStore(translateProjectSelector);

  const interfaceLang = useProjectStore(projectConfigSelector).selectedLanguage;

  React.useEffect(() => {
    const aborter = new AbortController();
    async function initPersons(aborter: AbortController) {
      const newPersons = await fetchPersons(israelsPersonsUrl, aborter.signal);
      if (!newPersons) return;

      newPersons.sort((a, b) =>
        a.sortLabel.localeCompare(b.sortLabel, "en", {
          sensitivity: "base",
          ignorePunctuation: true,
        }),
      );
      console.log(newPersons);
      setPersons(newPersons);
    }

    initPersons(aborter).catch(handleAbort);

    return () => {
      aborter.abort();
    };
  }, []);

  React.useEffect(() => {
    if (!persons) return;
    const persId = window.location.hash.split("#")[1];
    if (!persId) return;
    const element = personRefs.current[persId];
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      element.style.setProperty("background-color", "#FFCE01", "important");
      const timeout = setTimeout(() => {
        element.style.removeProperty("background-color");
      }, 2000);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [persons]);

  function searchPerson(per: Person) {
    const query: Partial<SearchQuery> = {
      terms: {
        persons: [per.sortLabel],
      },
    };

    const encodedQuery = encodeObject({ query: query });
    window.open(
      `${routerBasename === "/" ? "" : routerBasename}/?${encodedQuery}`,
      "_blank",
    );
  }

  function formatDate(
    lifespan: PersonLifespan | undefined,
  ): string | undefined {
    if (!lifespan?.when?.startsWith("-")) return lifespan?.when;
    return lifespan.when.split("-")[1] + " " + translateProject("BC");
  }

  return (
    <>
      <h1 className="pl-8">{translateProject("persons")}</h1>
      <div
        style={{
          gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
        }}
        className="grid gap-6 px-8 pb-8"
      >
        {persons?.map((per) => (
          <div
            className="h-36 max-w-[800px] rounded bg-neutral-50 p-5 transition-colors duration-500"
            key={per.id}
            ref={(el) => {
              personRefs.current[per.id] = el;
            }}
          >
            <div className="flex flex-row items-center">
              <div className="flex w-fit flex-grow flex-row items-center justify-start font-bold">
                {per.sortLabel}
              </div>
              {/* TODO: SVG wordt kleiner wanneer `displayLabel` langer is dan 1 regel */}
              <div className="flex flex-row items-center justify-end gap-1">
                {per.source
                  ? per.source.map((src, index) => (
                      <Button
                        className="flex items-center"
                        onPress={() => window.open(src, "_blank")}
                        key={index}
                      >
                        <HelpIcon />
                      </Button>
                    ))
                  : null}

                <Button onPress={() => searchPerson(per)}>
                  <MagnifyingGlassIcon
                    aria-hidden
                    className="h-4 w-4 cursor-pointer"
                  />
                </Button>
              </div>
            </div>
            <div>
              {/* TODO: deze elementen nog beter stylen. Onzekerheid beter weergeven, net als de `notBefore`. */}
              {formatDate(per.birth) || per.birth?.cert}
              {interfaceLang === "en" ? "–" : "-"}
              {formatDate(per.death) || per.death?.cert || per.death?.notBefore}
              {per.id}
            </div>
            {/*TODO: test person.note exists: */}
            <div>{per.note?.[interfaceLang].shortdesc}</div>
          </div>
        ))}
      </div>
    </>
  );
}

//TODO: generiek maken om zowel personen als kunstwerken aan te kunnen. URL verhuizen naar project config en deze dan aan de functie meegeven?
async function fetchPersons(
  url: string,
  signal: AbortSignal,
): Promise<Person[] | null> {
  const response = await fetch(url, { signal });
  if (!response.ok) {
    const error = await response.json();
    toast(`${error.message}`, { type: "error" });
    return null;
  }
  return await response.json();
}
