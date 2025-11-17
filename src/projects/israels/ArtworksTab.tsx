import { useAnnotationStore } from "../../stores/annotation";
import {
  projectConfigSelector,
  translateProjectSelector,
  useProjectStore,
} from "../../stores/project";
import { Any } from "../../utils/Any";
import {
  Artwork,
  Artworks,
  isArtworkEntity,
  IsraelsTeiRsBody,
} from "./annotation/ProjectAnnotationModel";

export const ArtworksTab = () => {
  const annotations = useAnnotationStore().annotations;
  const interfaceLang = useProjectStore(projectConfigSelector).selectedLanguage;
  const translateProject = useProjectStore(translateProjectSelector);

  const artworkAnnos = annotations.reduce<Artworks>((acc, anno) => {
    if (isArtworkAnno(anno)) {
      const artworkAnno = anno as unknown as {
        body: IsraelsTeiRsBody & { ref: Artworks };
      };
      artworkAnno.body.ref.forEach((artw) => {
        if (!acc.some((a) => a.id === artw.id)) {
          acc.push(artw as Artwork);
        }
      });
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
                parseInt(artwork.graphic.width),
                200,
              )},/0/default.jpg`}
              alt={artwork.head[interfaceLang]}
              loading="lazy"
            />
            <div className="font-bold">{artwork.head[interfaceLang]}</div>
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

function isArtworkAnno(
  anno: Any,
): anno is { body: IsraelsTeiRsBody & { metadata: { ref: Artworks } } } {
  return (
    anno.body.type === "tei:Rs" &&
    (anno.body as IsraelsTeiRsBody)["tei:type"] === "artwork" &&
    isArtworkEntity((anno.body as IsraelsTeiRsBody).ref)
  );
}
