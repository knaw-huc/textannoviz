import get from "lodash/get";
import { normalizeClassname } from "../../../components/Text/Annotated/utils/createAnnotationClasses";
import {
  AnnoRepoAnnotation,
  AnnoRepoBody,
  AnnoRepoBodyBase,
} from "../../../model/AnnoRepoAnnotation";
import { ViewLang } from "../../../model/Broccoli";
import { isArray, isString } from "lodash";

// ["Dataset","Division","Document","Entity","Head","Highlight","Letter","Line","List","ListItem","Note","Page","Paragraph","Picture","Quote","Reference","Whitespace"]
export const letter = "Letter";
export const highlight = "Highlight";
export const head = "Head";
export const entity = "Entity";
export const reference = "Reference";
export const listItem = "ListItem";
export const label = "Label";
export const quote = "Quote";
export const caption = "Caption";
export const page = "Page";
export const picture = "Picture";
export const artwork = "artwork";
export const person = "person";

export type ArtworkBody = AnnoRepoBodyBase & {
  type: "Entity";
  elementName: "rs";
  "tei:type": "artwork";
  "tei:ref": ArtworkTeiRef;
};
export type Artwork = ArtworkTeiRef;
type ArtworkTeiRef = {
  id: string;
  "tei:type": string;
  corresp: string;
  head: {
    nl: string;
    en: string;
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
  type: "Entity";
  elementName: "rs";
  "tei:type": "person";
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

type LetterTarget = string;
type BibliographyTarget = {
  id: string;
  label: string;
  title: {
    level: string;
    text: string;
  }[];
  text: string;
}[];

export type ReferenceBody =
  | LetterReferenceBody
  | BibliographyReferenceBody
  | NoteReferenceBody;

export const isReference = (
  toTest?: AnnoRepoBodyBase,
): toTest is ReferenceBody => !!toTest && toTest.type === "Reference";

export type BibliographyReferenceBody = AnnoRepoBodyBase & {
  target: BibliographyTarget;
  type: "Reference";
  elementName: string;
};
export const isBibliographyReference = (
  toTest?: AnnoRepoBodyBase,
): toTest is BibliographyReferenceBody => {
  const result =
    isReference(toTest) &&
    isArray((toTest as BibliographyReferenceBody).target);
  if (result) {
    console.log("// TODO: isBibliographyReference type?", toTest);
  }
  return result;
};

export type LetterReferenceBody = AnnoRepoBodyBase & {
  target: LetterTarget;
  type: "Reference";
  elementName: string;
};
export const isLetterReference = (
  toTest?: AnnoRepoBodyBase,
): toTest is LetterReferenceBody => {
  const result =
    isReference(toTest) && isString((toTest as LetterReferenceBody).target);
  if (result) {
    console.log("// TODO: isLetterReference type?", toTest);
  }
  return result;
};

export type NoteReferenceBody = AnnoRepoBodyBase & {
  type: "Reference";
  elementName: "ptr";
  "tei:type": "note";
  url: string;
};
export const isNoteReference = (
  toTest?: AnnoRepoBodyBase,
): toTest is NoteReferenceBody =>
  isReference(toTest) && (toTest as NoteReferenceBody)["tei:type"] === "note";

export type HeadBody = AnnoRepoBodyBase & {
  type: string;
  inFigure?: string;
  corresp: string;
  "tei:id": string;
  n?: string;
};

export const isHeadBody = (toTest?: AnnoRepoBodyBase): toTest is HeadBody =>
  !!toTest && toTest.type === "Head";

export type LetterBody = AnnoRepoBodyBase & {
  type: string;
  correspondent: string;
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
  title: Record<ViewLang, string>;
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
  const found = annotations.find((anno) => anno.body.type === "Letter");
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
  return toTest["tei:type"] === artwork;
};

const unknown = "unknown";

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
