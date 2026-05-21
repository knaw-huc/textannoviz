import { AnnoRepoAnnotation, AnnoRepoBody } from "./AnnoRepoAnnotation.ts";
import { BroccoliRelativeAnno } from "./Broccoli.ts";

export type WithRelativePosition<T extends object = AnnoRepoBody> = {
  annotation: AnnoRepoAnnotation<T>;
  relative: BroccoliRelativeAnno;
};
