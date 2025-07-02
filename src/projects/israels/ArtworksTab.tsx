import { useAnnotationStore } from "../../stores/annotation";
import { IsraelsTeiRsBody } from "./annotation/ProjectAnnotationModel";

export const ArtworksTab = () => {
  const annotations = useAnnotationStore().annotations;

  const artworkAnnos = annotations.filter((anno) => {
    return (
      anno.body.type === "tei:Rs" &&
      (anno.body as IsraelsTeiRsBody).metadata["tei:type"] === "artwork"
    );
  });
  console.log(artworkAnnos);

  return <div>Artworks</div>;
};
