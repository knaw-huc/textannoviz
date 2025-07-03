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

  const artworkAnnos = annotations.reduce<
    { body: IsraelsTeiRsBody & { metadata: { ref: Artworks } } }[]
  >((acc, anno) => {
    if (isArtworkAnno(anno)) {
      const artworkAnno = anno as unknown as {
        body: IsraelsTeiRsBody & { metadata: { ref: Artworks } };
      };
      const id = artworkAnno.body.metadata.ref[0].id;
      if (!acc.some((a) => a.body.metadata.ref[0].id === id)) {
        acc.push(artworkAnno);
      }
    }
    return acc;
  }, []);

  if (!artworkAnnos.length) return <div>No artworks in this letter.</div>;

  return (
    <>
      {artworkAnnos.map((artwork) => (
        <ul key={artwork.body.id}>
          <li>
            <div className="font-bold">
              {artwork.body.metadata.ref[0].head[interfaceLang]}
            </div>
            <div>
              <span>{artwork.body.metadata.ref[0].date.text}</span>
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
