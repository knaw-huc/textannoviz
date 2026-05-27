import { useAnnotationStore } from "../../stores/annotation";
import {
  projectConfigSelector,
  useTranslateProject,
  useProjectStore,
} from "../../stores/project";
import { firstLetterToUppercase } from "../../utils/firstLetterToUppercase";
import { Artwork, isArtwork } from "./annotation/ProjectAnnotationModel";

export const ArtworksTab = () => {
  const annotations = useAnnotationStore().annotations;
  const translateProject = useTranslateProject();

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

  // 12022026: SvD: Temp fix to filter out arrays in arrays. When there are 2 references in 1 ref element, it becomes an array in an array. It should be two separate entries.
  const filteredArtw = artworkAnnos.filter((artw) => !Array.isArray(artw));

  return (
    <>
      {filteredArtw.map((artwork) => (
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
              {artwork.relation?.map((creator) => (
                <div key={creator.ref}>
                  {firstLetterToUppercase(creator.name)}: {creator.label}
                </div>
              ))}
              {artwork.date ? <div>{artwork.date.text}</div> : null}
            </div>
          </li>
        </ul>
      ))}
    </>
  );
};
