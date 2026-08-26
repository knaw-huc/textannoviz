import {
  AnnoRepoAnnotation,
  AnnoRepoBodyBase,
} from "../../../model/AnnoRepoAnnotation";
import {
  BroccoliViews,
  ViewLang,
  BroccoliTextGeneric,
} from "../../../model/Broccoli";
import {
  letter,
  LetterBody,
} from "../../kunstenaarsbrieven/annotation/ProjectAnnotationModel";

export type MechteldVanGelreTextViews = BroccoliViews & {
  text: Record<ViewLang, BroccoliTextGeneric>;
  textNotes: Record<ViewLang, Record<string, BroccoliTextGeneric>>;
  regest?: Record<ViewLang, BroccoliTextGeneric>;
  publication?: Record<ViewLang, BroccoliTextGeneric>;
  seclit?: Record<ViewLang, BroccoliTextGeneric>;
};

export type MechteldLetterBody = LetterBody & {
  material: string;
  watermark: string;
  measure: string[];
  seal: string;
};

export function isMechteldLetterBody(
  toTest?: AnnoRepoBodyBase,
): toTest is MechteldLetterBody {
  return !!toTest && toTest.type === letter;
}

export function findMechteldLetterBody(
  annotations: AnnoRepoAnnotation[],
): MechteldLetterBody | undefined {
  const found = annotations.find((anno) => anno.body.type === letter);
  if (isMechteldLetterBody(found?.body)) {
    return found.body;
  }
}
