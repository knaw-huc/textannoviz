import { useAnnotationStore } from "../../stores/annotation";
import { projectConfigSelector, useProjectStore } from "../../stores/project";
import { Any } from "../../utils/Any";
import {
  Artworks,
  isArtworkEntity,
  IsraelsTeiRsBody,
} from "./annotation/ProjectAnnotationModel";

export const ArtworksTab = () => {
  const annotations = useAnnotationStore().annotations;
  const interfaceLang = useProjectStore(projectConfigSelector).selectedLanguage;

  const artworkAnnos = annotations.reduce<Artworks>((acc, anno) => {
    if (isArtworkAnno(anno)) {
      const artworkAnno = anno as unknown as {
        body: IsraelsTeiRsBody & { metadata: { ref: Artworks } };
      };
      artworkAnno.body.metadata.ref.forEach((artw) => {
        if (!acc.some((a) => a.id === artw.id)) {
          acc.push(artw);
        }
      });
    }
    return acc;
  }, []);

  if (!artworkAnnos.length) return <div>No artworks in this letter.</div>;

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
    (anno.body as IsraelsTeiRsBody).metadata["tei:type"] === "artwork" &&
    isArtworkEntity((anno.body as IsraelsTeiRsBody).metadata.ref)
  );
}
