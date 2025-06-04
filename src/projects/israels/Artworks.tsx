import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import React from "react";
import { toast } from "react-toastify";
import { SearchQuery } from "../../model/Search";
import { encodeObject } from "../../utils/UrlParamUtils";
import { handleAbort } from "../../utils/handleAbort";

type Artwork = {
  source: string;
  corresp: string;
  id: string;
  idno?: string;
  head: {
    lang: string;
    text: string;
  }[];
  date: {
    type: string;
    text: string;
  };
  relation: {
    name: string;
    ref: string;
  };
  graphic: {
    url: string;
  };
  measure: {
    commodity: string;
    unit: string;
    quantity: string;
  }[];
  note: {
    type: string;
    lang: string;
    text: string;
  }[];
};

type Artworks = Artwork[];

export function Artworks() {
  const [artworks, setArtworks] = React.useState<Artworks>();

  React.useEffect(() => {
    const aborter = new AbortController();
    async function initArtworks(aborter: AbortController) {
      const newArtworks = await fetchArtworks(aborter.signal);
      if (!newArtworks) return;

      setArtworks(newArtworks);
    }

    initArtworks(aborter).catch(handleAbort);

    return () => {
      aborter.abort();
    };
  }, []);

  function searchArtwork(artw: Artwork) {
    const query: Partial<SearchQuery> = {
      terms: {
        artworksNL: [artw.head[0].text],
      },
    };

    const encodedQuery = encodeObject({ query: query });
    window.open(`/?${encodedQuery}`, "_blank");
  }

  return (
    <>
      <h1 className="pl-8">Artworks</h1>
      <div
        style={{ gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))" }}
        className="grid gap-6 px-8 pb-8"
      >
        {artworks?.map((artw, index) => (
          <div
            key={index}
            className="h-36 max-w-[800px] rounded bg-neutral-50 p-5"
          >
            <div className="flex flex-row items-center">
              <div className="flex w-fit flex-grow flex-row items-center justify-start font-bold">
                {artw.head[0].text}
              </div>
              <div className="flex flex-row items-center justify-end gap-1">
                <MagnifyingGlassIcon
                  aria-hidden
                  className="h-4 w-4 cursor-pointer"
                  onClick={() => searchArtwork(artw)}
                />
              </div>
            </div>
            <div>{artw.idno ? `idno: ${artw.idno}` : null}</div>
          </div>
        ))}
      </div>
    </>
  );
}

//TODO: generiek maken om zowel personen als kunstwerken aan te kunnen. URL verhuizen naar project config en deze dan aan de functie meegeven?
async function fetchArtworks(signal: AbortSignal): Promise<Artworks | null> {
  const response = await fetch(
    "https://preview.dev.diginfra.org/files/00000000000000000000000b/apparatus/artwork-entities.json",
    { signal },
  );
  if (!response.ok) {
    const error = await response.json();
    toast(`${error.message}`, { type: "error" });
    return null;
  }
  return await response.json();
}
