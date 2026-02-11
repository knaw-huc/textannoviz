import { useAnnotationStore } from "../../stores/annotation";
import {
  projectConfigSelector,
  translateProjectSelector,
  useProjectStore,
} from "../../stores/project";
import { Artwork, isArtwork } from "./annotation/ProjectAnnotationModel";

export const ArtworksTab = () => {
  const annotations = useAnnotationStore().annotations;
  const translateProject = useProjectStore(translateProjectSelector);

  const interfaceLang = useProjectStore(projectConfigSelector).selectedLanguage;

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
            {artwork.graphic ? (
              <img
                src={`${artwork.graphic.url}/full/${Math.min(
                  artwork.graphic.width,
                  200,
                )},/0/default.jpg`}
                alt={artwork.head[interfaceLang]}
                loading="lazy"
              />
            ) : null}

            <div className="font-bold">{artwork.head[interfaceLang]}</div>
            <div>
              <div>{artwork.relation?.ref.displayLabel}</div>
              {artwork.date ? <div>{artwork.date.text}</div> : null}
            </div>
          </li>
        </ul>
      ))}
    </>
  );
};
