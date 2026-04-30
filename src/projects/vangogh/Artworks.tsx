import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import React from "react";
import { toast } from "../../utils/toast.ts";
import { SearchQuery } from "../../model/Search";
import { encodeObject } from "../../utils/url/UrlParamUtils";
import { handleAbort } from "../../utils/handleAbort";
import { type Artwork } from "../kunstenaarsbrieven/annotation/ProjectAnnotationModel.ts";
import {
  projectConfigSelector,
  useTranslateProject,
  useProjectStore,
} from "../../stores/project";
import { getViteEnvVars } from "../../utils/viteEnvVars";
import { Button } from "react-aria-components";

export function Artworks() {
  const [artworks, setArtworks] = React.useState<Artwork[]>([]);
  const artworkRefs = React.useRef<Record<string, HTMLDivElement | null>>({});
  const interfaceLang = useProjectStore(projectConfigSelector).selectedLanguage;
  const { routerBasename } = getViteEnvVars();
  const translateProject = useTranslateProject();
  const artworksUrl = useProjectStore(projectConfigSelector).artworksUrl;

  React.useEffect(() => {
    const aborter = new AbortController();
    async function initArtworks(aborter: AbortController) {
      const newArtworks = await fetchArtworks(artworksUrl, aborter.signal);
      if (!newArtworks) return;

      newArtworks.sort((a, b) => {
        return a.head[interfaceLang].localeCompare(
          b.head[interfaceLang],
          "en",
          {
            sensitivity: "base",
            ignorePunctuation: true,
          },
        );
      });

      setArtworks(newArtworks);
    }

    initArtworks(aborter).catch(handleAbort);

    return () => {
      aborter.abort();
    };
  }, []);

  React.useEffect(() => {
    if (!artworks) return;
    const artwId = window.location.hash.split("#")[1];
    if (!artwId) return;
    const element = artworkRefs.current[artwId];
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
  }, [artworks]);

  function searchArtwork(artw: Artwork) {
    const query: Partial<SearchQuery> = {
      terms: {
        [`artworkIds`]: [artw.id],
      },
    };

    const encodedQuery = encodeObject({ query: query });
    window.open(
      `${routerBasename === "/" ? "" : routerBasename}/?${encodedQuery}`,
      "_blank",
    );
  }

  return (
    <>
      <h1 className="pl-8">{translateProject("artworks")}</h1>
      <div
        style={{ gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))" }}
        className="grid gap-6 px-8 pb-8"
      >
        {artworks.map((artw: Artwork) => (
          <div
            key={artw.id}
            className=" h-auto max-w-[800px] rounded bg-neutral-50 p-5"
            ref={(el) => {
              artworkRefs.current[artw.id] = el;
            }}
          >
            <div className="flex flex-row items-center">
              <div className="flex w-fit flex-grow flex-row items-center justify-start font-bold">
                {artw.head[interfaceLang].length
                  ? artw.head[interfaceLang]
                  : `${artw.id} has no/empty/incorrect 'head' element in XML!`}
              </div>
              <div className="flex flex-row items-center justify-end gap-1">
                <Button onPress={() => searchArtwork(artw)}>
                  <MagnifyingGlassIcon
                    aria-hidden
                    className="h-4 w-4 cursor-pointer"
                  />
                </Button>
              </div>
            </div>
            {artw.relation
              ? artw.relation.map((relation, key) => (
                  <div key={key}>
                    {translateProject(relation.name)}: {relation.label}
                  </div>
                ))
              : null}
            {artw.date?.text ? (
              <div>
                {translateProject("date")}: {artw.date.text}
              </div>
            ) : null}

            {artw.measure ? (
              <div>
                {translateProject("size")}: {artw.measure[0].quantity} x{" "}
                {artw.measure[1].quantity} {artw.measure[0].unit}
              </div>
            ) : null}

            {artw.note?.some((note) => note.type === "technical") ? (
              <div>
                {translateProject("support")}:{" "}
                {Object.values(artw.note)
                  .filter((value) => value.type === "technical")
                  .map((value, index) => (
                    <span key={index}>{value.text}</span>
                  ))}
              </div>
            ) : null}

            {artw.note?.some((note) => note.type === "collection") ? (
              <div>
                {translateProject("collection")}:{" "}
                {Object.values(artw.note)
                  .filter((value) => value.type === "collection")
                  .map((value, index) => (
                    <span key={index}>{value.text}</span>
                  ))}
              </div>
            ) : null}

            {artw.idno?.some((idno) => idno.type === "inventory") ? (
              <div>
                {translateProject("inventory")}:{" "}
                {Object.values(artw.idno)
                  .filter((value) => value.type === "inventory")
                  .map((value, index) => (
                    <span key={index}>{value.text}</span>
                  ))}
              </div>
            ) : null}

            {artw.note?.some((note) => note.type === "creditline") ? (
              <div>
                {translateProject("credits")}:{" "}
                {Object.values(artw.note)
                  .filter((value) => value.type === "creditline")
                  .map((value, index) => (
                    <span key={index}>{value.text}</span>
                  ))}
              </div>
            ) : null}

            {artw.bibl ? (
              <div>
                In: <span className="italic">{artw.bibl.title}</span>
                <span>
                  {" "}
                  {artw.bibl.biblScope
                    ?.filter((scope) => scope.unit === "volume")
                    .map((scope) => scope.text)}
                </span>
                <span>
                  {" "}
                  ({artw.bibl.date}),{" "}
                  {artw.bibl.biblScope
                    ?.filter((scope) => scope.unit === "page")
                    .map((scope) => scope.text)}
                </span>
              </div>
            ) : null}

            {artw.graphic ? (
              <div className="pt-4">
                <img
                  src={`${artw.graphic.url}/full/${Math.min(
                    artw.graphic.width,
                    200,
                  )},/0/default.jpg`}
                  alt={artw.head[interfaceLang]}
                  loading="lazy"
                />
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </>
  );
}

//TODO: generiek maken om zowel personen als kunstwerken aan te kunnen. URL verhuizen naar project config en deze dan aan de functie meegeven?
async function fetchArtworks(
  url: string,
  signal: AbortSignal,
): Promise<Artwork[] | null> {
  const response = await fetch(url, { signal });
  if (!response.ok) {
    const error = await response.json();
    toast(`${error.message}`, { type: "error" });
    return null;
  }
  return await response.json();
}
