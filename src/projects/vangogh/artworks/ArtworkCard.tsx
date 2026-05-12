import { LanguageCode } from "../../../model/Language";
import { useTranslateProject } from "../../../stores/project";
import { Artwork } from "../../kunstenaarsbrieven/annotation/ProjectAnnotationModel";

export function ArtworkCard(props: {
  artwork: Artwork;
  interfaceLang: LanguageCode;
}) {
  const { artwork, interfaceLang } = props;
  const translateProject = useTranslateProject();

  return (
    <div className="h-auto rounded bg-neutral-50 p-5 shadow-sm">
      <div className="font-bold">
        {artwork.head[interfaceLang].length
          ? artwork.head[interfaceLang]
          : `${artwork.id} has no/empty/incorrect 'head' element in XML!`}
      </div>
      {artwork.relation
        ? artwork.relation.map((relation) => (
            <div key={relation.label}>
              {translateProject(relation.name)}: {relation.label}
            </div>
          ))
        : null}
      {artwork.date?.text ? (
        <div>
          {translateProject("date")}: {artwork.date.text}
        </div>
      ) : null}
      {artwork.measure ? (
        <div>
          {translateProject("size")}: {artwork.measure[0].quantity} x{" "}
          {artwork.measure[1].quantity} {artwork.measure[0].unit}
        </div>
      ) : null}
      {artwork.note?.some((note) => note.type === "technical") ? (
        <div>
          {translateProject("support")}:{" "}
          {Object.values(artwork.note)
            .filter((value) => value.type === "technical")
            .map((value, index) => (
              <span key={index}>{value.text}</span>
            ))}
        </div>
      ) : null}
      {artwork.note?.some((note) => note.type === "collection") ? (
        <div>
          {translateProject("collection")}:{" "}
          {Object.values(artwork.note)
            .filter((value) => value.type === "collection")
            .map((value, index) => (
              <span key={index}>{value.text}</span>
            ))}
        </div>
      ) : null}
      {artwork.idno?.some((idno) => idno.type === "inventory") ? (
        <div>
          {translateProject("inventory")}:{" "}
          {Object.values(artwork.idno)
            .filter((value) => value.type === "inventory")
            .map((value, index) => (
              <span key={index}>{value.text}</span>
            ))}
        </div>
      ) : null}
      {artwork.note?.some((note) => note.type === "creditline") ? (
        <div>
          {translateProject("credits")}:{" "}
          {Object.values(artwork.note)
            .filter((value) => value.type === "creditline")
            .map((value, index) => (
              <span key={index}>{value.text}</span>
            ))}
        </div>
      ) : null}
      {artwork.bibl ? (
        <div>
          In: <span className="italic">{artwork.bibl.title}</span>
          <span>
            {" "}
            {artwork.bibl.biblScope
              ?.filter((scope) => scope.unit === "volume")
              .map((scope) => scope.text)}
          </span>
          <span>
            {" "}
            ({artwork.bibl.date}),{" "}
            {artwork.bibl.biblScope
              ?.filter((scope) => scope.unit === "page")
              .map((scope) => scope.text)}
          </span>
        </div>
      ) : null}
      {artwork.graphic && (
        <img
          src={`${artwork.graphic.url}/full/200,/0/default.jpg`}
          alt={artwork.head[interfaceLang]}
          loading="lazy"
          className="mt-4 rounded"
        />
      )}
    </div>
  );
}
