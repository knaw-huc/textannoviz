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
  const translateProject = useTranslateProject();
  const artworksUrl = useProjectStore(projectConfigSelector).artworksUrl;

  React.useEffect(() => {
    const aborter = new AbortController();
    async function initArtworks(aborter: AbortController) {
      const newArtworks = await fetchArtworks(artworksUrl, aborter.signal);
      if (!newArtworks) return;

      (Object.keys(newArtworks) as Array<keyof ArtworkData>).forEach((key) => {
        newArtworks[key] = [...newArtworks[key]].sort((a, b) => {
          const labelA =
            a.relation?.find((rel) => rel.name === "creator")?.sortLabel || "";
          const labelB =
            b.relation?.find((rel) => rel.name === "creator")?.sortLabel || "";

          return labelA.localeCompare(labelB, "en", {
            sensitivity: "base",
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

  return (
    <>
      <h1 className="pl-8">{translateProject("artworks")}</h1>
      <ArtworkTabs artworks={artworks} />
    </>
  );
}
