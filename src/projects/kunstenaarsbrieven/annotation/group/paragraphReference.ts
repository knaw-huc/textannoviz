/**
 * A paragraph a reference points at, either in the current letter or, when
 * letterId is set, in another one.
 */
export type ParagraphReferenceTarget = {
  letterId?: string;
  paragraphId: string;
};

// A paragraph anchor, optionally preceded by the letter holding it, e.g.
// "#p.orig.57" or "let093.xml#p.orig.21"
const PARAGRAPH_REFERENCE = /^(?:([^#]+)\.xml)?#(p\.[^#]+)$/;

// Paragraph ids name the text they are in: "p.orig.21" is in the original
const PARAGRAPH_PANEL = /^p\.(orig|trans)\./;

export function parseParagraphReference(
  url: string | undefined,
): ParagraphReferenceTarget | null {
  const match = url?.match(PARAGRAPH_REFERENCE);
  if (!match) {
    return null;
  }
  const [, letterId, paragraphId] = match;
  return letterId ? { letterId, paragraphId } : { paragraphId };
}

/**
 * The panel showing a paragraph, or undefined when the id is not a paragraph's
 */
export function getParagraphPanel(paragraphId: string): string | undefined {
  const match = paragraphId.match(PARAGRAPH_PANEL);
  return match ? `text.${match[1]}` : undefined;
}
