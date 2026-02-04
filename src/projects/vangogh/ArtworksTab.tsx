import { useAnnotationStore } from "../../stores/annotation";
import {
  translateProjectSelector,
  useProjectStore,
} from "../../stores/project";
import { Artwork, isArtwork } from "./annotation/ProjectAnnotationModel";

export const ArtworksTab = () => {
  const annotations = useAnnotationStore().annotations;
  const translateProject = useProjectStore(translateProjectSelector);

  const artworkAnnos = annotations.reduce<Artwork[]>((acc, anno) => {
    if (isArtwork(anno.body)) {
      const artwork = anno.body["tei:ref"];
      if (!acc.some((a) => a.id === artwork.id)) {
        acc.push(artwork);
      }
    }
    return acc;
  }, []);

  if (!artworkAnnos.length) return <div>{translateProject("NO_ARTWORKS")}</div>;

  return (
    <>
      {artworkAnnos.map((artwork) => (
        <ul key={artwork.id}>
          <li>
            <img
              src={`${artwork.graphic.url}/full/${Math.min(
                artwork.graphic.width,
                200,
              )},/0/default.jpg`}
              alt={artwork.head.text}
              loading="lazy"
            />
            <div className="font-bold">{artwork.head.text}</div>
            <div>
              <div>{artwork.relation?.ref.displayLabel}</div>
              <div>{artwork.date.text}</div>
            </div>
          </li>
        </ul>
      ))}
    </>
  );
};
