import {
  AnnoRepoAnnotation,
  AnnoRepoBody,
} from "../../../../model/AnnoRepoAnnotation.ts";
import { BroccoliRelativeAnno } from "../../../../model/Broccoli.ts";

export type WithRelativePosition<T extends object = AnnoRepoBody> = {
  annotation: AnnoRepoAnnotation<T>;
  relative: BroccoliRelativeAnno;
};
