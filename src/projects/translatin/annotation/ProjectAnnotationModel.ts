import {
  AnnoRepoAnnotation,
  AnnoRepoBodyBase,
} from "../../../model/AnnoRepoAnnotation";

const head = "Head";
const highlight = "Highlight";
const quote = "Quote";
const document = "Document";

export const projectHighlightedTypes = [head, quote, highlight];

export type DocumentBody = AnnoRepoBodyBase & {
  type: typeof document;
  id: string;
  title: string;
  subtitle: string;
  author: string;
  editor: string;
  datePublished: string;
  publisher: string;
  location: string;
  firstEdition: string;
  bibl: string;
  genre: string;
};

export function findDocumentBody(
  annotations: AnnoRepoAnnotation[],
): DocumentBody | undefined {
  const found = annotations.find((anno) => anno.body.type === document);
  if (isDocumentBody(found?.body)) {
    return found.body;
  }
}

export function isDocumentBody(
  toTest?: AnnoRepoBodyBase,
): toTest is DocumentBody {
  if (!toTest) {
    return false;
  }
  return toTest.type === document;
}
