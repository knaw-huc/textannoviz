import { useTextStore } from "../../../stores/text/text-store";
import { MechteldVanGelreTextViews } from "../annotation/ProjectAnnotationModel";

export const useMechteldVanGelreTextViews = () =>
  useTextStore((state) => state.views) as MechteldVanGelreTextViews | undefined;
