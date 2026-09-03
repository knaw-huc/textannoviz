import get from "lodash/get";
import { normalizeClassname } from "../../../components/Text/Annotated/utils/createAnnotationClasses.ts";
import {
  AnnoRepoAnnotation,
  AnnoRepoBody,
  AnnoRepoBodyBase,
} from "../../../model/AnnoRepoAnnotation";
import {
  BroccoliTextGeneric,
  BroccoliViews,
  ViewLang,
} from "../../../model/Broccoli";
import {
  AnnotationSegment,
  BlockSchema,
} from "../../../components/Text/Annotated/core";
import { isHighlightSegment } from "../../../components/Text/Annotated/core/AnnotationModel.ts";
import {
  projectConfigSelector,
  useProjectStore,
} from "../../../stores/project.ts";

/**
 * Kunstenaarsbrieven Annotation, element and tei type names
 */

export const addition = "Addition";
export const caption = "Caption";
export const cell = "Cell";
export const deletion = "Deletion";
export const document = "Document";
export const elementRs = "rs";
export const elementPtr = "ptr";
export const entity = "Entity";
export const head = "Head";
export const highlight = "Highlight";
export const label = "Label";
export const letter = "Letter";
export const list = "List";
export const listItem = "ListItem";
export const note = "Note";
export const page = "Page";
export const paragraph = "Paragraph";
export const person = "person";
export const picture = "Picture";
export const quote = "Quote";
export const reference = "Reference";
export const row = "Row";
export const supplied = "Supplied";
export const table = "Table";
export const term = "Term";
export const teiArtwork = "artwork";
export const teiNote = "note";
export const unclear = "Unclear";
export const unknown = "unknown";
export const whitespace = "Whitespace";

/**
 * Lazy: the project config is only set in the store after App has loaded it
 */
export const getBaseUrl = () =>
  `/detail/urn:mace:huc.knaw.nl:${
    projectConfigSelector(useProjectStore.getState()).id
  }:`;

export type KunstenaarsbrievenTextViews = BroccoliViews & {
  text: Record<ViewLang, BroccoliTextGeneric>;
  textNotes: Record<ViewLang, Record<string, BroccoliTextGeneric>>;
  transcrSource?: Record<ViewLang, BroccoliTextGeneric>;
  dating?: Record<ViewLang, BroccoliTextGeneric>;
  remarks?: Record<ViewLang, BroccoliTextGeneric>;
  ogtNotes?: Record<ViewLang, BroccoliTextGeneric>;
};

export type ArtworkSections =
  | "illustrated"
  | "illustrations"
  | "non-illustrated"
  | "sketches";

export type ArtworkBody = AnnoRepoBodyBase & {
  type: typeof entity;
  elementName: typeof elementRs;
  "tei:type": typeof teiArtwork;
  "tei:ref": ArtworkTeiRef | ArtworkTeiRef[];
};

export type Artwork = ArtworkTeiRef;
type ArtworkTeiRef = {
  id: string;
  corresp?: string;
  idno?: {
    type?: string;
    "tei:type"?: string;
    text: string;
  }[];
  head: {
    nl: string;
    en: string;
  };
  label: {
    type: string;
    text: string;
  };
  date?: {
    type: string;
    text: string;
  };
  relation?: {
    name: string;
    ref: string;
    displayLabel: string;
    sortLabel: string;
  }[];
  graphic?: {
    url: string;
    width: number;
    height: number;
  };
  measure: {
    commodity: string;
    unit: string;
    quantity: string;
  }[];
  catRef?: {
    scheme: string;
    target: string;
  }[];
  note?: {
    type: string;
    text: string;
  }[];
  bibl?: {
    title: string;
    biblScope?: {
      unit: string;
      text: string;
    }[];
    date: string;
  };
};

export type PersonBody = AnnoRepoBodyBase & {
  type: typeof entity;
  elementName: typeof elementRs;
  "tei:type": typeof person;
  "tei:ref": PersonTeiRef | PersonTeiRef[];
};
export type Person = PersonTeiRef;
export type PersonTeiRef = {
  id: string;
  gender?: string;
  source?: string[];
  persName: PersonPersName[];
  floruit?: {
    when?: string;
    notBefore?: string;
    notAfter?: string;
  };
  birth?: PersonLifespan;
  death?: PersonLifespan; //There are living persons in the data, so made this optional
  displayLabel: string;
  sortLabel: string;
  note?: Partial<Record<ViewLang, Record<string, string>>>;
};

export type PersonPersName = {
  full: "yes" | "abb";
  forename?: string | null;
  addName?: string;
  surname?:
    | string
    | null
    | (string | { type: "married-name"; text: string } | null)[];
  nameLink?: string;
};

export type ResolvedSurname = {
  text: string;
  type?: "married-name";
};

export type PersonLifespan = {
  when?: string;
  cert?: string;
  notBefore?: string;
  notAfter?: string;
};

export type EntityRefs = PersonTeiRef | Artwork;

export type IsraelsEntityBody = PersonBody | ArtworkBody;

export type ReferenceBody =
  | LetterReferenceBody
  | BibliographyReferenceBody
  | NoteReferenceBody;

export const isReference = (
  toTest?: AnnoRepoBodyBase,
): toTest is ReferenceBody => !!toTest && toTest.type === reference;

export type WhitespaceBody = AnnoRepoBodyBase & {
  type: typeof whitespace;
  isTextSuffix?: boolean;
  elementName?: string;
  "tei:unit"?: string;
  "tei:quantity"?: number;
};
export const isWhitespace = (
  toTest?: AnnoRepoBodyBase,
): toTest is WhitespaceBody => !!toTest && toTest.type === whitespace;

export const isHorizontalWhitespace = (
  toTest?: AnnoRepoBodyBase,
): toTest is WhitespaceBody =>
  isWhitespace(toTest) &&
  toTest.elementName === "space" &&
  toTest["tei:unit"] === "chars";

export type BibliographyReferenceBody = AnnoRepoBodyBase & {
  id: string;
  url: string;
  type: typeof reference;
  subtype: "BibReference";
  elementName: string;
};
export const isBibliographyReference = (
  toTest?: AnnoRepoBodyBase,
): toTest is BibliographyReferenceBody => {
  return (
    isReference(toTest) &&
    (toTest as BibliographyReferenceBody).subtype?.startsWith("BibReference")
  );
};

export const isInternalReference = (
  toTest?: AnnoRepoBodyBase,
): toTest is BibliographyReferenceBody => {
  if (!isReference(toTest)) return false;
  const url = (toTest as BibliographyReferenceBody).url;
  return !!url && !url.startsWith("http") && !url.startsWith("#p.");
};

export const isParagraphReference = (
  toTest?: AnnoRepoBodyBase,
): toTest is BibliographyReferenceBody => {
  if (!isReference(toTest)) return false;
  const url = (toTest as BibliographyReferenceBody).url;
  return !!url && url.startsWith("#p.");
};

export type LetterReferenceBody = AnnoRepoBodyBase & {
  id: string;
  type: typeof reference;
  subtype: "LetterReference";
  url: string;
  elementName: string;
};
export const isLetterReference = (
  toTest?: AnnoRepoBodyBase,
): toTest is LetterReferenceBody => {
  return (
    isReference(toTest) &&
    (toTest as LetterReferenceBody).subtype === "LetterReference"
  );
};

export type NoteReferenceBody = AnnoRepoBodyBase & {
  type: typeof reference;
  elementName: typeof elementPtr;
  "tei:type": typeof teiNote;
  url: string;
  subtype: string;
};
export const isNoteReference = (
  toTest?: AnnoRepoBodyBase,
): toTest is NoteReferenceBody => {
  return (
    isReference(toTest) &&
    (toTest as NoteReferenceBody)["elementName"] === "ptr"
  );
};

export type HeadBody = AnnoRepoBodyBase & {
  type: typeof head;
  inFigure?: string;
  corresp: string;
  "xml:id": string;
  n?: string;
};

export const isHeadBody = (toTest?: AnnoRepoBodyBase): toTest is HeadBody =>
  !!toTest && toTest.type === head;

export type LetterBody = AnnoRepoBodyBase & {
  type: typeof letter;
  correspondent: string;
  sender: string | string[];
  n: string;
  collectedLetters: string;
  institution?: string;
  letterid: string;
  location: string;
  identifier?: string;
  period: string;
  periodlong: string;
  prevLetter: string;
  nextLetter: string;
  titles: Record<ViewLang, string>;
  title: string;
  recipient: string | string[];
  shelfmark: string;
  fromLocation: string;
  toLocation: string;
  dateSent: string;
  place?: string;
  collection?: string;
};

export function isLetterBody(toTest?: AnnoRepoBodyBase): toTest is LetterBody {
  if (!toTest) {
    return false;
  }
  return toTest.type === letter;
}

export function findLetterBody(
  annotations: AnnoRepoAnnotation[],
): LetterBody | undefined {
  const found = annotations.find((anno) => anno.body.type === letter);
  if (isLetterBody(found?.body)) {
    return found.body;
  }
}

export type ParagraphBody = AnnoRepoBodyBase & {
  elementName: string;
  n: string;
  "tei:corresp": string;
  "xml:id": string;
  style: string;
  "tei:rend": string;
};

export function isParagraphBody(
  toTest?: AnnoRepoBodyBase,
): toTest is ParagraphBody {
  return !!toTest && toTest.type === paragraph;
}

export type PictureBody = AnnoRepoBodyBase & {
  elementName: string;
  "xml:id": string;
  n: string;
  "tei:facs": string;
  url: string;
};

export function isPictureBody(
  toTest?: AnnoRepoBodyBase,
): toTest is PictureBody {
  return !!toTest && toTest.type === picture;
}

export type BibleReferenceBody = AnnoRepoBodyBase & {
  "tei:cRef": string;
  label: string;
  elementName: "ref";
};

export function isBibleReferenceBody(
  toTest?: AnnoRepoBodyBase,
): toTest is BibleReferenceBody {
  return (
    !!toTest &&
    "tei:cRef" in toTest &&
    (toTest as BibleReferenceBody)["tei:cRef"].startsWith("bible")
  );
}

export const entityTypes = [entity, reference];
export const highlightTypes = [
  highlight,
  listItem,
  quote,
  caption,
  term,
  supplied,
  whitespace,
  deletion,
  addition,
  unclear,
];
export const tooltipMarkerTypes = [reference];
export const insertMarkerTypes = [picture, head];
export const listTypes = [list, listItem];
export const tableTypes = [cell, row, table];
/**
 * See {@link blockSchema}
 */
export const blockTypes = [head, page, paragraph, ...tableTypes, ...listTypes];

export const typesToInclude = [
  ...new Set([
    ...insertMarkerTypes,
    ...tooltipMarkerTypes,
    ...highlightTypes,
    ...entityTypes,
    ...blockTypes,
  ]),
];

export const isEntity = (
  toTest: AnnoRepoBodyBase,
): toTest is IsraelsEntityBody => {
  return entityTypes.includes(toTest.type);
};

export const isPerson = (toTest: AnnoRepoBodyBase): toTest is PersonBody => {
  if (!isEntity(toTest)) {
    return false;
  }
  return toTest["tei:type"] === person;
};

export function isPersonBody(toTest: EntityRefs): toTest is PersonTeiRef {
  return "birth" in toTest;
}

export const isArtwork = (toTest: AnnoRepoBodyBase): toTest is ArtworkBody => {
  if (!isEntity(toTest)) {
    return false;
  }
  return toTest["tei:type"] === teiArtwork;
};

// This check is still fragile. TODO: find better way to detect if ref is an artwork
export function isArtworkBody(toTest: EntityRefs): toTest is Artwork {
  return !toTest.id.startsWith("vg");
}

export type ListAnnotationBody = AnnoRepoBodyBase & {
  type: "List";
  elementName: "listAnnotation";
  language: string;
  "tei:type": string;
};

export function isListAnnotation(
  toTest: AnnoRepoBodyBase,
): toTest is ListAnnotationBody {
  return (
    toTest.type === "List" &&
    (toTest as ListAnnotationBody).elementName === "listAnnotation"
  );
}

export function getAnnotationCategory(annoRepoBody: AnnoRepoBody) {
  if ([head, reference, caption].includes(annoRepoBody.type)) {
    return normalizeClassname(annoRepoBody.type);
  } else if (annoRepoBody.type === highlight) {
    return get(annoRepoBody, "style") ?? unknown;
  } else if (annoRepoBody.type === entity) {
    return get(annoRepoBody, "tei:type") ?? unknown;
  } else {
    console.warn("Could not find annotation category:", annoRepoBody);
    return unknown;
  }
}

export function getHighlightCategory(annoRepoBody: AnnoRepoBody) {
  if (
    [
      head,
      caption,
      label,
      listItem,
      quote,
      term,
      supplied,
      whitespace,
      addition,
      deletion,
      unclear,
    ].includes(annoRepoBody.type)
  ) {
    return normalizeClassname(annoRepoBody.type);
  } else if (annoRepoBody.type === highlight) {
    return get(annoRepoBody, "style");
  } else {
    console.warn("Could not find highlight category:", annoRepoBody);
    return unknown;
  }
}

export const isQuote = (toTest: AnnotationSegment): boolean =>
  isHighlightSegment(toTest) &&
  (toTest.body as AnnoRepoBodyBase).type === quote;

export const entityCategoryToAgg: Record<string, string> = {
  PER: "persons",
  ART: "artworks",
};

/**
 * See {@link blockTypes} and {@link KunstenaarsbrievenBlock}
 */
export const blockSchema: BlockSchema = {
  root: "root",
  blocks: {
    root: { children: [head, list, page, paragraph, table] },
    [cell]: { children: [] },
    [head]: { children: [] },
    [list]: { children: [listItem] },
    [page]: { children: [paragraph, head, table, list] },
    [paragraph]: { children: [] },
    [row]: { children: [cell] },
    [table]: { children: [row] },
  },
};

export const isInsertMarker = (body: AnnoRepoBodyBase) =>
  insertMarkerTypes.includes(body.type) || isHorizontalWhitespace(body);

export const isMarker = (body: AnnoRepoBodyBase) =>
  isInsertMarker(body) || isNoteReference(body);

export const getMarkerPosition = (body: AnnoRepoBodyBase) =>
  isHeadBody(body) ? "prefix" : "postfix";

export const isBlock = (body: AnnoRepoBodyBase) =>
  blockTypes.includes(body.type) && !isListAnnotation(body);

export const getBlockType = (body: AnnoRepoBodyBase) => body.type;
