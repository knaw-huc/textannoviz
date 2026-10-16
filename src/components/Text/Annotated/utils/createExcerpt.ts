/**
 * A hit with a little of the text around it, so hits that matched the same
 * value can be told apart in a list.
 */
export type Excerpt = {
  /** Text leading up to the hit, starting with "…" when it was cut */
  before: string;
  /** The hit itself, spelled as the text spells it */
  match: string;
  /** Text following the hit, ending with "…" when it was cut */
  after: string;
};

const ELLIPSIS = "…";

/**
 * Cut an excerpt around a hit from begin up to end in body.
 *
 * Takes up to radius characters on either side — characters rather than
 * words, as short words would make a word count uneven — and cuts back to
 * the nearest word boundary, so it never starts or ends mid-word. Only when a
 * side holds part of a single long word does it cut that word, rather than
 * leave that side empty.
 *
 * Whitespace is collapsed: texts keep their line breaks, which would break a
 * one-line list row.
 */
export function createExcerpt(
  body: string,
  begin: number,
  end: number,
  radius = 40,
): Excerpt {
  let from = Math.max(0, begin - radius);
  let to = Math.min(body.length, end + radius);

  if (from > 0 && !/\s/.test(body[from - 1])) {
    const boundary = body.slice(from, begin).search(/\s/);
    // A boundary right against the hit would leave nothing of this side
    if (boundary !== -1 && body.slice(from + boundary, begin).trim()) {
      from += boundary;
    }
  }
  if (to < body.length && !/\s/.test(body[to])) {
    const boundary = lastWhitespace(body.slice(end, to));
    if (boundary !== -1 && body.slice(end, end + boundary).trim()) {
      to = end + boundary;
    }
  }

  const isCutBefore = body.slice(0, from).trim() !== "";
  const isCutAfter = body.slice(to).trim() !== "";
  const before = collapse(body.slice(from, begin)).trimStart();
  const after = collapse(body.slice(end, to)).trimEnd();

  return {
    before: isCutBefore && before ? ELLIPSIS + before : before,
    match: collapse(body.slice(begin, end)),
    after: isCutAfter && after ? after + ELLIPSIS : after,
  };
}

function collapse(text: string): string {
  return text.replace(/\s+/g, " ");
}

function lastWhitespace(text: string): number {
  for (let i = text.length - 1; i >= 0; i--) {
    if (/\s/.test(text[i])) {
      return i;
    }
  }
  return -1;
}
