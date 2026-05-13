import React from "react";
import { handleAbort } from "../../../utils/handleAbort.tsx";
import {
  ArtworkSections,
  type Artwork,
} from "../../kunstenaarsbrieven/annotation/ProjectAnnotationModel.ts";
import {
  projectConfigSelector,
  useTranslateProject,
  useProjectStore,
} from "../../../stores/project.ts";
import { ArtworkTabs } from "./ArtworkTabs.tsx";
import { fetchArtworks } from "./fetchArtworks.ts";

export type ArtworkData = Record<ArtworkSections, Artwork[]>;

export function Artworks() {
  const [artworks, setArtworks] = React.useState<Partial<ArtworkData>>({});
  // const artworkRefs = React.useRef<Record<string, HTMLDivElement | null>>({});
  const interfaceLang = useProjectStore(projectConfigSelector).selectedLanguage;
  const translateProject = useTranslateProject();
  const artworksUrl = useProjectStore(projectConfigSelector).artworksUrl;

  React.useEffect(() => {
    const aborter = new AbortController();
    async function initArtworks(aborter: AbortController) {
      const newArtworks = await fetchArtworks(artworksUrl, aborter.signal);
      if (!newArtworks) return;

      (Object.keys(newArtworks) as Array<keyof ArtworkData>).forEach((key) => {
        newArtworks[key] = [...newArtworks[key]].sort((a, b) => {
          const labelA = a.head[interfaceLang] || "";
          const labelB = b.head[interfaceLang] || "";

          return labelA.localeCompare(labelB, "en", {
            sensitivity: "base",
            ignorePunctuation: true,
          });
        });
      });

      setArtworks(newArtworks);
    }

    initArtworks(aborter).catch(handleAbort);

    return () => {
      aborter.abort();
    };
  }, []);

  // React.useEffect(() => {
  //   if (!artworks) return;
  //   const artwId = window.location.hash.split("#")[1];
  //   if (!artwId) return;
  //   const element = artworkRefs.current[artwId];
  //   if (element) {
  //     element.scrollIntoView({ behavior: "smooth", block: "center" });
  //     element.style.setProperty("background-color", "#FFCE01", "important");
  //     const timeout = setTimeout(() => {
  //       element.style.removeProperty("background-color");
  //     }, 2000);
  //     return () => {
  //       clearTimeout(timeout);
  //     };
  //   }
  // }, [artworks]);

  return (
    <>
      <h1 className="mb-0 pl-8">{translateProject("artworks")}</h1>
      <ArtworkTabs artworks={artworks} />
    </>
  );
}
