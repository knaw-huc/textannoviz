import { useAnnotationStore } from "../../stores/annotation";
import {
  projectConfigSelector,
  useTranslateProject,
  useProjectStore,
} from "../../stores/project";
import { Artwork, isArtwork } from "./annotation/ProjectAnnotationModel";

export const ArtworksTab = () => {
  const annotations = useAnnotationStore().annotations;
  const translateProject = useTranslateProject();

  const interfaceLang = useProjectStore(projectConfigSelector).selectedLanguage;

  const artworkAnnos = annotations.reduce<Artwork[]>((acc, anno) => {
    if (isArtwork(anno.body)) {
      const artwork = anno.body["tei:ref"];

      const artworks = Array.isArray(artwork) ? artwork : [artwork];

      for (const item of artworks) {
        if (!acc.some((a) => a.id === item.id)) {
          acc.push(item);
        }
      }
    }
    return acc;
  }, []);

  if (!artworkAnnos.length) return <div>{translateProject("NO_ARTWORKS")}</div>;

  // 12022026: SvD: Temp fix to filter out arrays in arrays. When there are 2 references in 1 ref element, it becomes an array in an array. It should be two separate entries.
  // 26052026: SvD: disabled for now to see if this is still an issue
  // const filteredArtw = artworkAnnos.filter((artw) => !Array.isArray(artw));

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
              <div>{artwork.relation?.ref?.displayLabel}</div>
              {artwork.date ? <div>{artwork.date.text}</div> : null}
            </div>
          </li>
        </ul>
      ))}
    </>
  );
};
