import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import React from "react";
import { toast } from "../../utils/toast.ts";
import { SearchQuery } from "../../model/Search";
import { encodeObject } from "../../utils/UrlParamUtils";
import { handleAbort } from "../../utils/handleAbort";
import { type Artwork } from "./annotation/ProjectAnnotationModel";
import {
  projectConfigSelector,
  translateProjectSelector,
  useProjectStore,
} from "../../stores/project";
import { getViteEnvVars } from "../../utils/viteEnvVars";
import { Button } from "react-aria-components";

export function Artworks() {
  const [artworks, setArtworks] = React.useState<Artwork[]>([]);
  const artworkRefs = React.useRef<Record<string, HTMLDivElement | null>>({});
  const interfaceLang = useProjectStore(projectConfigSelector).selectedLanguage;
  const { israelsArtworksUrl, routerBasename } = getViteEnvVars();
  const translateProject = useProjectStore(translateProjectSelector);

  React.useEffect(() => {
    const aborter = new AbortController();
    async function initArtworks(aborter: AbortController) {
      const newArtworks = await fetchArtworks(
        israelsArtworksUrl,
        aborter.signal,
      );
      if (!newArtworks) return;

      const filteredArtworks = newArtworks.filter(
        (artw) => artw.type !== "ill",
      );

      filteredArtworks.sort((a, b) =>
        a.head[interfaceLang].localeCompare(b.head[interfaceLang], "en", {
          sensitivity: "base",
          ignorePunctuation: true,
        }),
      );

      setArtworks(filteredArtworks);
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
        [`artworks${interfaceLang.toUpperCase()}`]: [artw.head[interfaceLang]],
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
        {artworks.map((artw, index) => (
          <div
            key={index}
            className=" h-auto max-w-[800px] rounded bg-neutral-50 p-5"
            ref={(el) => {
              artworkRefs.current[artw.id] = el;
            }}
          >
            <div className="flex flex-row items-center">
              <div className="flex w-fit flex-grow flex-row items-center justify-start font-bold">
                {artw.head[interfaceLang]}
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
            {artw.relation.ref.displayLabel ? (
              <div>
                {translateProject("artist")}: {artw.relation.ref.displayLabel}
              </div>
            ) : null}
            <div>
              {translateProject("date")}: {artw.date.text}
            </div>
            <div>
              {Object.entries(artw.note[interfaceLang])
                .filter(([key]) => key === "creditline")
                .map(([, value], index) => (
                  <span key={index}>
                    {translateProject("credits")}: {value}
                  </span>
                ))}
            </div>
            {Object.entries(artw.note[interfaceLang])
              .filter(([key]) => key === "photocredits")
              .map(([, value], index) =>
                value.length ? <span key={index}>{value}</span> : null,
              )}
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
