import { ProjectConfig } from "../../../model/ProjectConfig";
import { Artwork } from "../../kunstenaarsbrieven/annotation/ProjectAnnotationModel";
import { ArtworkData } from "./Artworks";

export async function fetchArtworks(
  sources: ProjectConfig["artworksUrl"],
  signal: AbortSignal,
): Promise<ArtworkData | undefined> {
  try {
    const results = await Promise.all(
      sources.map(async (source) => {
        const response = await fetch(source.url, { signal });
        if (!response.ok) throw new Error(`Failed to fetch ${source.key}`);
        const json: Artwork[] = await response.json();
        return { key: source.key, json };
      }),
    );

    const finalObject = results.reduce((acc, current) => {
      acc[current.key] = current.json;
      return acc;
    }, {} as ArtworkData);

    return finalObject;
  } catch (error) {
    console.error("Fetch error:", error);
  }
}
