// Matches a header anchor and captures its trailing numeric part, dropping the
// prefix/chapter segments before it. Handles any prefix and an optional chapter
// segment, e.g.:
//   "#intro.VI.5.3.1" -> "5.3.1"
//   "#overview.4"     -> "4"
export const INTERNAL_ANCHOR = /#[^#]*?\.(\d+(?:\.\d+)*)$/;

// Matches a reference to a whole document without an anchor, e.g. "introIV.xml"
export const INTERNAL_DOCUMENT = /^[^#]+\.xml$/;

export function isInternalReferenceUrl(url: string): boolean {
  return INTERNAL_ANCHOR.test(url) || INTERNAL_DOCUMENT.test(url);
}

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
