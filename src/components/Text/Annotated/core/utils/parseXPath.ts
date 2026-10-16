export type XPathStep = { tag: string; index: number };

/**
 * Matches a single xpath step, e.g. "tei:cell[2]":
 * - namespace: optional namespace prefix, e.g. "tei"
 * - tag: the element name, e.g. "cell"
 * - index: the optional 1-based predicate, e.g. "2"
 */
const XPATH_STEP_PATTERN =
  /^(?:(?<namespace>\w+):)?(?<tag>[^[]+)(?:\[(?<index>\d+)])?$/;

export function parseXPath(xpath: string): XPathStep[] {
  return xpath
    .split("/")
    .filter((part) => !!part)
    .map((step) => {
      const { tag, index } = step.match(XPATH_STEP_PATTERN)!.groups!;
      return { tag, index: index ? parseInt(index, 10) : 1 };
    });
}
