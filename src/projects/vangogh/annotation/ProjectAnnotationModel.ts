import get from "lodash/get";
import { normalizeClassname } from "../../../components/Text/Annotated/utils/createAnnotationClasses";
import {
  AnnoRepoAnnotation,
  AnnoRepoBody,
  AnnoRepoBodyBase,
} from "../../../model/AnnoRepoAnnotation";
import { ViewLang } from "../../../model/Broccoli";

/**
 * Israels Annotation, element and tei type names
 */

export const caption = "Caption";
export const document = "Document";
export const elementRs = "rs";
export const elementPtr = "ptr";
export const entity = "Entity";
export const head = "Head";
export const highlight = "Highlight";
export const label = "Label";
export const letter = "Letter";
export const listItem = "ListItem";
export const note = "Note";
export const page = "Page";
export const person = "person";
export const picture = "Picture";
export const quote = "Quote";
export const reference = "Reference";
export const teiArt = "art";
export const teiArtwork = "artwork";
export const teiIll = "ill";
export const teiNote = "note";
export const unknown = "unknown";

export type ArtworkBody = AnnoRepoBodyBase & {
  type: typeof entity;
  elementName: typeof elementRs;
  "tei:type": typeof teiArtwork;
  "tei:ref": ArtworkTeiRef;
};

export type Artwork = ArtworkTeiRef;
type ArtworkTeiRef = {
  id: string;
  // TODO: check if source truely exists in peenless:
  source: string[];
  "tei:type": typeof teiIll | typeof teiArt;
  corresp: string;
  // head: {
  //   nl: string;
  //   en: string;
  // };
  head: {
    type: string;
    text: string;
  };
  date: {
    "tei:type": string;
    text: string;
  };
  relation?: {
    name: string;
    ref: {
      id: string;
      gender: string;
      source: string[];
      persName: Array<{
        full: string;
        forename: string;
        nameLink: string;
        surname: string[];
      }>;
      birth: {
        when: string;
      };
      death: {
        when: string;
      };
      displayLabel: string;
      sortLabel: string;
    };
  };
  graphic: {
    url: string;
    width: number;
    height: number;
  };
  measure: {
    commodity: string;
    unit: string;
    quantity: string;
  }[];
  note: {
    nl: {
      technical: string;
      creditline: string;
      collection: string;
    };
    en: {
      technical: string;
      creditline: string;
      collection: string;
    };
  };
};

export type PersonBody = AnnoRepoBodyBase & {
  type: typeof entity;
  elementName: typeof elementRs;
  "tei:type": typeof person;
  "tei:ref": PersonTeiRef;
};
export type Person = PersonTeiRef;
export type PersonTeiRef = {
  id: string;
  gender: string;
  source: string[];
  persName: PersonPersName[];
  birth: PersonBirth;
  death: PersonDeath;
  displayLabel: string;
  sortLabel: string;
  note?: Record<ViewLang, Record<string, string>>;
};

type PersonPersName = {
  full: string;
  forename: string;
  addName?: string;
  surname: string[] | { type: string; text: string };
  nameLink?: string;
};

type PersonBirth = {
  when?: string;
  cert?: string;
};

type PersonDeath = PersonBirth & {
  notBefore?: string;
};

export type IsraelsEntityBody = PersonBody | ArtworkBody;

export type ReferenceBody =
  | LetterReferenceBody
  | BibliographyReferenceBody
  | NoteReferenceBody;

export const isReference = (
  toTest?: AnnoRepoBodyBase,
): toTest is ReferenceBody => !!toTest && toTest.type === reference;

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
  const result =
    isReference(toTest) &&
    (toTest as BibliographyReferenceBody).subtype === "BibReference";

  return result;
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
  const result =
    isReference(toTest) &&
    (toTest as LetterReferenceBody).subtype === "LetterReference";

  return result;
};

export type NoteReferenceBody = AnnoRepoBodyBase & {
  type: typeof reference;
  elementName: typeof elementPtr;
  "tei:type": typeof teiNote;
  url: string;
};
export const isNoteReference = (
  toTest?: AnnoRepoBodyBase,
): toTest is NoteReferenceBody =>
  isReference(toTest) && (toTest as NoteReferenceBody)["tei:type"] === teiNote;

export type HeadBody = AnnoRepoBodyBase & {
  type: typeof head;
  inFigure?: string;
  corresp: string;
  "tei:id": string;
  n?: string;
};

export const isHeadBody = (toTest?: AnnoRepoBodyBase): toTest is HeadBody =>
  !!toTest && toTest.type === head;

export type LetterBody = AnnoRepoBodyBase & {
  type: typeof letter;
  recipient: string;
  sender: string;
  n: string;
  institution: string;
  letterid: string;
  location: string;
  identifier: string;
  period: string;
  periodlong: string;
  prevLetter: string;
  nextLetter: string;
  titles: Record<ViewLang, string>;
  title: string;
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

export const projectEntityTypes = [entity, reference];
export const projectHighlightedTypes = [
  highlight,
  head,
  listItem,
  quote,
  caption,
];
export const projectTooltipMarkerAnnotationTypes = [reference];
export const projectPageMarkerAnnotationTypes = [page];
export const projectInsertTextMarkerAnnotationTypes = [picture, head];

export const projectAnnotationTypesToInclude = [
  ...new Set([
    ...projectInsertTextMarkerAnnotationTypes,
    ...projectPageMarkerAnnotationTypes,
    ...projectTooltipMarkerAnnotationTypes,
    ...projectHighlightedTypes,
    ...projectEntityTypes,
  ]),
];

export const isEntity = (
  toTest: AnnoRepoBodyBase,
): toTest is IsraelsEntityBody => {
  return projectEntityTypes.includes(toTest.type);
};

export const isPerson = (toTest: AnnoRepoBodyBase): toTest is PersonBody => {
  if (!isEntity(toTest)) {
    return false;
  }
  return toTest["tei:type"] === person;
};

export const isArtwork = (toTest: AnnoRepoBodyBase): toTest is ArtworkBody => {
  if (!isEntity(toTest)) {
    return false;
  }
  return toTest["tei:type"] === teiArtwork;
};

export function getAnnotationCategory(annoRepoBody: AnnoRepoBody) {
  if ([head, reference, caption].includes(annoRepoBody.type)) {
    return normalizeClassname(annoRepoBody.type);
  } else if (annoRepoBody.type === highlight) {
    return get(annoRepoBody, "metadata.rend") ?? unknown;
  } else if (annoRepoBody.type === entity) {
    return get(annoRepoBody, "tei:type") ?? unknown;
  } else {
    console.warn("Could not find annotation category:", annoRepoBody);
    return unknown;
  }
}

export function getHighlightCategory(annoRepoBody: AnnoRepoBody) {
  if ([head, caption, label, listItem, quote].includes(annoRepoBody.type)) {
    return normalizeClassname(annoRepoBody.type);
  } else if (annoRepoBody.type === highlight) {
    return get(annoRepoBody, "metadata.rend");
  } else {
    console.warn("Could not find highlight category:", annoRepoBody);
    return unknown;
  }
}

export const entityCategoryToAgg: Record<string, string> = {
  PER: "persons",
  ART: "artworks",
};
