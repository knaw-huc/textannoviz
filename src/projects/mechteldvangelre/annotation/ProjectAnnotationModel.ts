import {
  BroccoliViews,
  ViewLang,
  BroccoliTextGeneric,
} from "../../../model/Broccoli";

export type MechteldVanGelreTextViews = BroccoliViews & {
  text: Record<ViewLang, BroccoliTextGeneric>;
  textNotes: Record<ViewLang, Record<string, BroccoliTextGeneric>>;
  regest?: Record<ViewLang, BroccoliTextGeneric>;
  publication?: Record<ViewLang, BroccoliTextGeneric>;
  seclit?: Record<ViewLang, BroccoliTextGeneric>;
};
