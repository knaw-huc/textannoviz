import React from "react";
import { toast } from "react-toastify";

type Artwork = {
  source: string;
  corresp: string;
  id: string;
  idno: string;
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

export function Artworks() {
  const [artworks, setArtworks] = React.useState<Artwork[]>();

  React.useEffect(() => {
    async function initArtworks() {
      const newArtworks = await fetchArtworks();
      if (!newArtworks) return;

      setArtworks(newArtworks);
    }

    initArtworks();
  }, []);

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
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

async function fetchArtworks(): Promise<Artwork[] | null> {
  const response = await fetch(
    "https://preview.dev.diginfra.org/files/00000000000000000000000b/apparatus/artwork-entities.json",
  );
  if (!response.ok) {
    const error = await response.json();
    toast(`${error.message}`, { type: "error" });
    return null;
  }
  return await response.json();
}
