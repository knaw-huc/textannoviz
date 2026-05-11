import { LanguageCode } from "../../../model/Language";
import { Artwork } from "../../kunstenaarsbrieven/annotation/ProjectAnnotationModel";

export function ArtworkCard(props: {
  artwork: Artwork;
  interfaceLang: LanguageCode;
}) {
  const { artwork, interfaceLang } = props;

  return (
    <div className="h-auto rounded bg-neutral-50 p-5 shadow-sm">
      <div className="font-bold">
        {artwork.head[interfaceLang].length
          ? artwork.head[interfaceLang]
          : `${artwork.id} has no/empty/incorrect 'head' element in XML!`}
      </div>
      {artwork.graphic && (
        <img
          src={`${artwork.graphic.url}/full/200,/0/default.jpg`}
          alt={artwork.head[interfaceLang]}
          loading="lazy"
          className="rounded"
        />
      )}
    </div>
  );
}
