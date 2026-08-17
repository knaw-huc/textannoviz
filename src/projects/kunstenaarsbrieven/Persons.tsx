import React from "react";
import { toast } from "../../utils/toast.ts";
import { SearchQuery } from "../../model/Search";
import { encodeObject } from "../../utils/url/UrlParamUtils";
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { HelpIcon } from "../../components/common/icons/HelpIcon";
import { handleAbort } from "../../utils/handleAbort";
import {
  PersonLifespan,
  PersonPersName,
  ResolvedSurname,
  type Person,
} from "./annotation/ProjectAnnotationModel";
import { getViteEnvVars } from "../../utils/viteEnvVars";
import {
  projectConfigSelector,
  useTranslateProject,
  useProjectStore,
  useTranslate,
} from "../../stores/project";
import { Button } from "react-aria-components";

type PersonsProps = {
  personsUrl: string;
};

export function Persons(props: PersonsProps) {
  const [persons, setPersons] = React.useState<Person[]>();
  const personRefs = React.useRef<Record<string, HTMLDivElement | null>>({});
  const { routerBasename } = getViteEnvVars();
  const translateProject = useTranslateProject();
  const translate = useTranslate();

  const interfaceLang = useProjectStore(projectConfigSelector).selectedLanguage;

  React.useEffect(() => {
    const aborter = new AbortController();
    async function initPersons(aborter: AbortController) {
      const newPersons = await fetchPersons(props.personsUrl, aborter.signal);
      if (!newPersons) return;

      newPersons.sort((a, b) =>
        a.sortLabel.localeCompare(b.sortLabel, "en", {
          sensitivity: "base",
        }),
      );
      setPersons(newPersons);
    }

    initPersons(aborter).catch(handleAbort);

    return () => {
      aborter.abort();
    };
  }, [props.personsUrl]);

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
    const date = formatDateValue(lifespan);
    if (date === undefined) return undefined;
    return lifespan?.cert ? `${translate("CIRCA_ABBRV")} ${date}` : date;
  }

  /**
   * TEI dates are ISO-8601: a leading `-` marks a year before the common era.
   * Both the sign and the leading zeros are stripped.
   */
  function formatYear(year: string): string {
    if (!year.startsWith("-")) return String(Number(year));
    return `${Number(year.slice(1))} ${translate("BC")}`;
  }

  function formatDateValue(
    lifespan: PersonLifespan | undefined,
  ): string | undefined {
    if (!lifespan) return undefined;
    const { when, notBefore, notAfter } = lifespan;

    if (when) return formatYear(when);

    if (notBefore && !notAfter)
      return `${translate("AFTER")} ${formatYear(notBefore)}`;
    if (notAfter && !notBefore)
      return `${translate("BEFORE")} ${formatYear(notAfter)}`;
    if (notBefore && notAfter)
      return `${translate("BETWEEN")} ${formatYear(notBefore)} ${translate(
        "AND",
      )} ${formatYear(notAfter)}`;

    return undefined;
  }

  function resolveSurnames(name: PersonPersName): ResolvedSurname[] {
    const raw = name.surname;
    if (!raw) return [];
    if (typeof raw === "string") return [{ text: raw }];
    return raw.flatMap<ResolvedSurname>((item) => {
      if (!item) return [];
      if (typeof item === "string") return [{ text: item }];
      return [{ text: item.text, type: item.type }];
    });
  }

  /**
   * Formats a name surname-first, mirroring the `sortLabel` convention:
   * "Ter Borch the Younger, Gerard", "Honcoop (Aertsen-Honcoop), Mientje".
   */
  function formatName(name: PersonPersName): string {
    const surnames = resolveSurnames(name);
    const married = surnames.filter((s) => s.type === "married-name");

    const family = [
      name.nameLink,
      ...surnames.filter((s) => s.type !== "married-name").map((s) => s.text),
      married.length ? `(${married.map((s) => s.text).join(", ")})` : undefined,
      name.addName,
    ]
      .filter((part): part is string => !!part)
      .join(" ");

    if (!family) return name.forename ?? "";
    if (!name.forename) return family;
    return `${family}, ${name.forename}`;
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
        {persons?.map((per) => {
          const fullName =
            per.persName.find((n) => n.full === "yes") ?? per.persName[0];
          const hasAbbreviation = per.persName.some((n) => n.full === "abb");

          return (
            <div
              className="min-h-36 max-w-[800px] rounded bg-neutral-50 p-5 transition-colors duration-500"
              key={per.id}
              ref={(el) => {
                personRefs.current[per.id] = el;
              }}
            >
              <div className="flex flex-row items-start">
                <div className="flex w-fit flex-grow flex-col justify-start">
                  <span className="font-bold">{formatName(fullName)}</span>
                  {/* `sortLabel` is built from the abbreviated form, so only
                    show it when there is one to differ from the full name. */}
                  {hasAbbreviation ? <span>{per.sortLabel}</span> : null}
                </div>
                <div className="flex shrink-0 flex-row items-center justify-end gap-1">
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
              {per.birth || per.death ? (
                <>
                  {" "}
                  <div>
                    {formatDate(per.birth)}
                    {interfaceLang === "en" ? " – " : " - "}
                    {formatDate(per.death)}
                  </div>
                </>
              ) : null}
              {per.floruit ? (
                <div>
                  {per.floruit?.when
                    ? `floruit: ${formatYear(per.floruit.when)}`
                    : null}
                  {per.floruit?.notAfter && per.floruit?.notBefore
                    ? `floruit: ${translate("BETWEEN")} ${formatYear(
                        per.floruit.notBefore,
                      )} ${translate("AND")} ${formatYear(
                        per.floruit.notAfter,
                      )}`
                    : null}
                </div>
              ) : null}

              <div>{per.note?.[interfaceLang]?.shortdesc}</div>
            </div>
          );
        })}
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
