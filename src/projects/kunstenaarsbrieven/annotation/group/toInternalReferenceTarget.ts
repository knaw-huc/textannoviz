// Matches a header anchor and captures its trailing numeric part, dropping the
// prefix/chapter segments before it. Handles any prefix and an optional chapter
// segment, e.g.:
//   "#intro.VI.5.3.1" -> "5.3.1"
//   "#overview.4"     -> "4"
export const INTERNAL_ANCHOR = /#[^#]*?\.(\d+(?:\.\d+)*)$/;

export function toInternalReferenceTarget(
  url: string,
  tier2: string | undefined,
  projectName: string,
): string {
  const anchored = url
    .replace(".xml", "")
    .replace(INTERNAL_ANCHOR, "#toc-head.$1");
  return anchored.startsWith("#")
    ? `/detail/${tier2}${anchored}` // internal: current doc, new anchor
    : `/detail/urn:mace:huc.knaw.nl:${projectName}:${anchored}`;
}
