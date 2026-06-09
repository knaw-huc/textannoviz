import { useTextStore } from "../../../stores/text/text-store";
import { KunstenaarsbrievenTextViews } from "../annotation/ProjectAnnotationModel";

export const useKunstenaarsbrievenTextViews = () =>
  useTextStore((state) => state.views) as
    | KunstenaarsbrievenTextViews
    | undefined;
