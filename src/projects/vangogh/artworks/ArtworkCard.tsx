import { Button, Link } from "react-aria-components";
import { LanguageCode } from "../../../model/Language";
import { useTranslateProject } from "../../../stores/project";
import {
  Artwork,
  getBaseUrl,
  getIdnoEntries,
} from "../../kunstenaarsbrieven/annotation/ProjectAnnotationModel";
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { HelpIcon } from "../../../components/common/icons/HelpIcon";
import { isExternalUrl } from "../../kunstenaarsbrieven/annotation/LinkUtils";

export function ArtworkCard(props: {
  artwork: Artwork;
  interfaceLang: LanguageCode;
  handleSearch: (artwork: Artwork) => void;
}) {
  const { artwork, interfaceLang } = props;
  const translateProject = useTranslateProject();

  return (
    <div className="h-auto rounded bg-neutral-50 p-5 shadow-sm">
      <div className="mb-4 flex flex-row items-center">
        <div className="flex w-fit flex-grow flex-row items-center justify-start font-bold">
          {artwork.head[interfaceLang].length
            ? artwork.head[interfaceLang]
            : `${artwork.id} has no/empty/incorrect 'head' element in XML!`}
        </div>
        <div className="flex shrink-0 flex-row items-center justify-end gap-1">
          {artwork.corresp
            ? artwork.corresp
                .split(/\s+/)
                .map((splitCorresp) => (
                  <HelpLink key={splitCorresp} corresp={splitCorresp} />
                ))
            : null}
          <Button onPress={() => props.handleSearch(artwork)}>
            <MagnifyingGlassIcon
              aria-hidden
              className="h-4 w-4 cursor-pointer"
            />
          </Button>
        </div>
      </div>
      {artwork.relation
        ? artwork.relation.map((relation) => (
            <div key={relation.displayLabel}>
              {translateProject(relation.name)}:{" "}
              {relation.fullName ?? relation.displayLabel}
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
      {artwork.note?.[interfaceLang]?.technical ? (
        <div>
          {translateProject("support")}: {artwork.note[interfaceLang].technical}
        </div>
      ) : null}
      {artwork.note?.[interfaceLang]?.collection ? (
        <div>
          {translateProject("collection")}:{" "}
          {artwork.note[interfaceLang].collection}
        </div>
      ) : null}
      {getIdnoEntries(artwork).some((idno) => idno.type === "inventory") ? (
        <div>
          {translateProject("inventory")}:{" "}
          {getIdnoEntries(artwork)
            .filter((value) => value.type === "inventory")
            .map((value, index) => (
              <span key={index}>{value.text}</span>
            ))}
        </div>
      ) : null}
      {getIdnoEntries(artwork).some((idno) => idno.type?.startsWith("VG-")) ? (
        <div>
          {translateProject("catalogueNum")}:{" "}
          {getIdnoEntries(artwork)
            .filter((value) => value.type?.startsWith("VG-"))
            .map((value) => `${value.type?.replace("VG-", "")} ${value.text}`)
            .join(" / ")}
        </div>
      ) : null}
      {artwork.note?.[interfaceLang]?.creditline ? (
        <div>
          {translateProject("credits")}:{" "}
          {artwork.note[interfaceLang].creditline}
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
          src={`${artwork.graphic.url}/full/${Math.min(
            artwork.graphic.width,
            300,
          )},/0/default.jpg`}
          alt={artwork.head[interfaceLang]}
          loading="lazy"
          className="mt-4 rounded"
        />
      )}
    </div>
  );
}

/**
 * A corresp is either a letter ("let093.xml") or an external url
 */
function HelpLink(props: { corresp: string }) {
  const { corresp } = props;
  let href: string;
  if (corresp.endsWith(".xml")) {
    // Router-relative: React Aria resolves it with the router basename
    href = `${getBaseUrl()}${corresp.split(".")[0]}`;
  } else if (isExternalUrl(corresp)) {
    href = corresp;
  } else {
    return null;
  }

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center"
    >
      <HelpIcon title={corresp} />
    </Link>
  );
}
