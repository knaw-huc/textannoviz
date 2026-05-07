import { LanguageCode } from "../../../model/Language";
import { Artwork } from "../../kunstenaarsbrieven/annotation/ProjectAnnotationModel";

export function ArtworkCard(props: {
  artwork: Artwork;
  interfaceLang: LanguageCode;
}) {
  return (
    <div className="h-auto rounded bg-neutral-50 p-5 shadow-sm">
      <div className="font-bold">
        {props.artwork.head[props.interfaceLang].length
          ? props.artwork.head[props.interfaceLang]
          : `${props.artwork.id} has no/empty/incorrect 'head' element in XML!`}
      </div>
      {props.artwork.graphic && (
        <img
          src={`${props.artwork.graphic.url}/full/200,/0/default.jpg`}
          alt={props.artwork.head[props.interfaceLang]}
          loading="lazy"
          className="rounded"
        />
      )}
    </div>
  );
}
