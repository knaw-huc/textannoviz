import get from "lodash/get";
import { normalizeClassname } from "../../../components/Text/Annotated/utils/createAnnotationClasses";
import {
  AnnoRepoBody,
  AnnoRepoBodyBase,
} from "../../../model/AnnoRepoAnnotation";
import { ViewLang } from "../../../model/Broccoli";

export type Artwork = {
  source: string[];
  corresp: string;
  id: string;
  idno?: string;
  head: ArtworkHead;
  date: ArtworkDate;
  relation?: ArtworkRelation;
  graphic: ArtworkGraphic;
  measure?: ArtworkMeasure[];
  note: ArtworkNote;
};

type ArtworkHead = Record<ViewLang, string>;

type ArtworkDate = {
  "tei:type": string;
  text: string;
};

type ArtworkRelation = {
  name: string;
  ref: ArtworkRelationRef;
  label?: string;
};

type ArtworkRelationRef = Person;

type ArtworkGraphic = {
  url: string;
};

type ArtworkMeasure = {
  commodity: string;
  unit: string;
  quantity: string;
};

type ArtworkNote = Record<ViewLang, Record<string, string>>;

export type Artworks = Artwork[];

export type Person = {
  id: string;
  sex: string;
  source?: string[];
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

export type Persons = Person[];

export type IsraelsTeiRsBody = AnnoRepoBodyBase & {
  metadata: {
    type: string;
    "tei:type": string;
    ref: IsraelsTeiRsPersonRef | IsraelsTeiRsArtworkRef;
  };
};

export type IsraelsTeiRsPersonRef = Persons;
export type IsraelsTeiRsArtworkRef = Artworks;

export type IsraelsEntityBody = IsraelsTeiRsBody;

export type IsraelsTeiRefBody = AnnoRepoBodyBase & {
  metadata: {
    target:
      | string
      | {
          id: string;
          label: string;
          title: {
            level: string;
            text: string;
          }[];
          text: string;
        }[];
    type: string;
  };
};

export type IsraelsTeiHeadBody = AnnoRepoBodyBase & {
  metadata: {
    type: string;
    inFigure?: string;
    corresp: string;
    "tei:id": string;
    n: string;
  };
};

const teiHi = "tei:Hi";
const teiHead = "tei:Head";
const teiRs = "tei:Rs";
const teiRef = "tei:Ref";
const teiItem = "tei:Item";
const teiLabel = "tei:Label";

export const projectEntityTypes = [teiRs, teiRef];
export const projectHighlightedTypes = [teiHi, teiHead, teiItem, teiLabel];
export const projectTooltipMarkerAnnotationTypes = ["tei:Ptr"];
export const projectPageMarkerAnnotationTypes = ["tf:Page"];

export const projectInsertTextMarkerAnnotationTypes = [
  "tei:Space",
  "tei:Graphic",
  "tei:Head",
];

export const isEntity = (
  toTest: AnnoRepoBodyBase,
): toTest is IsraelsEntityBody => {
  return projectEntityTypes.includes(toTest.type);
};

export const isPersonEntity = (
  toTest: Persons | Artworks,
): toTest is IsraelsTeiRsPersonRef => {
  return Array.isArray(toTest) && toTest.length > 0 && "persName" in toTest[0];
};

export const isArtworkEntity = (
  toTest: Persons | Artworks,
): toTest is IsraelsTeiRsArtworkRef => {
  return Array.isArray(toTest) && toTest.length > 0 && "graphic" in toTest[0];
};

export function getAnnotationCategory(annoRepoBody: AnnoRepoBody) {
  if (annoRepoBody.type === teiHi) {
    return get(annoRepoBody, "metadata.rend") ?? "unknown";
  } else if (annoRepoBody.type === teiHead) {
    return normalizeClassname(teiHead);
  } else if (annoRepoBody.type === teiRs) {
    return get(annoRepoBody, "metadata.tei:type") ?? "unknown";
  } else if (annoRepoBody.type === teiRef) {
    return normalizeClassname(teiRef);
  } else {
    return "unknown";
  }
}

export function getHighlightCategory(annoRepoBody: AnnoRepoBody) {
  if (annoRepoBody.type === teiHi) {
    return get(annoRepoBody, "metadata.rend");
  } else if (annoRepoBody.type === teiHead) {
    const headBody = annoRepoBody as IsraelsTeiHeadBody;
    //There can be heads without a metadata block
    if (headBody.metadata?.inFigure?.length) {
      return "caption";
    } else {
      return normalizeClassname(teiHead);
    }
  } else if (annoRepoBody.type === teiLabel) {
    return normalizeClassname(teiLabel);
  } else if (annoRepoBody.type === teiItem) {
    return normalizeClassname(teiItem);
  } else {
    console.warn("Could not find highlight category", annoRepoBody);
    return "unknown";
  }
}

export const entityCategoryToAgg: Record<string, string> = {
  PER: "persons",
  ART: "artworks",
};
