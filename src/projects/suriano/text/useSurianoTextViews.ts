import { useTextStore } from "../../../stores/text/text-store";
import { SurianoTextViews } from "../annotation/ProjectAnnotationModel";

export const useSurianoTextViews = () =>
  useTextStore((state) => state.views) as SurianoTextViews | undefined;
