import { GetLocationTexts } from "../../../components/Text/Annotated/utils/resolveSearchHits";
import { KunstenaarsbrievenTextViews } from "../annotation/ProjectAnnotationModel";

type MetadataView = "dating" | "transcrSource" | "remarks" | "pubhistory";

/**
 * The texts a project's metadata tab renders, in the order it renders them.
 *
 * Mirrors a MetadataPanel: it reads each view in English whatever the
 * interface language, and leaves out views with an empty body. The resolver
 * lists hits in this order, so pass the views in the order the panel shows
 * them, and keep the two in step. The panel's other fields are plain values,
 * not annotated text, so hold nothing to scroll to.
 */
export function createGetMetadataTexts(
  viewNames: MetadataView[],
): GetLocationTexts {
  return (views) => {
    const textViews = views as KunstenaarsbrievenTextViews;
    return viewNames.flatMap((viewName) => {
      const text = textViews[viewName]?.en;
      return text?.body.length ? [text] : [];
    });
  };
}
