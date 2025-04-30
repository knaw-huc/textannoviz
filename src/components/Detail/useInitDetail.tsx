import { useEffect, useState } from "react";
import { useAnnotationStore } from "../../stores/annotation.ts";
import { useMiradorStore } from "../../stores/mirador.ts";
import {
  projectConfigSelector,
  useProjectStore,
} from "../../stores/project.ts";
import { useTextStore } from "../../stores/text.ts";
import { fetchBroccoliScanWithOverlap } from "../../utils/broccoli.ts";
import { handleAbort } from "../../utils/handleAbort.tsx";
import { NOTES_VIEW } from "../Text/Annotated/MarkerTooltip.tsx";
import { useDetailNavigation } from "./useDetailNavigation.tsx";

/**
 * Initialize views, annotations and iiif
 * 'Re-initialize' when tier2 changes
 */
export function useInitDetail() {
  const projectConfig = useProjectStore(projectConfigSelector);
  const { projectName } = useProjectStore();
  const { getDetailParams } = useDetailNavigation();

  const [isInitDetail, setInitDetail] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const { setStore } = useMiradorStore();
  const { setCurrentCanvas } = useMiradorStore();
  const { setAnnotations } = useAnnotationStore();
  const { setViews } = useTextStore();

  const { tier2 } = useDetailNavigation().getDetailParams();
  const [prevTier2, setPrevTier2] = useState(tier2);

  useEffect(() => {
    if (tier2 === prevTier2) {
      return;
    }
    setInitDetail(false);
    setPrevTier2(tier2);
  }, [tier2]);

  useEffect(() => {
    if (isInitDetail || isLoading) {
      return;
    }

    const aborter = new AbortController();
    initDetail(aborter).catch(handleAbort);

    return () => {
      aborter.abort();
      setLoading(false);
    };

    async function initDetail(aborter: AbortController) {
      setLoading(true);
      const { tier2 } = getDetailParams();
      if (!tier2) {
        return;
      }
      const bodyId = tier2;
      const includeResults = ["anno", "iiif", "text"];

      const viewNames = projectConfig.allPossibleTextPanels.toString();

      const overlapTypes = projectConfig.annotationTypesToInclude;
      const relativeTo = "Origin";

      const result = await fetchBroccoliScanWithOverlap(
        bodyId,
        overlapTypes,
        includeResults,
        viewNames,
        relativeTo,
        projectConfig,
        aborter.signal,
      );

      if (!result) {
        return;
      }

      const annotations = result.anno;
      const views = result.views;

      if (
        projectName === "suriano" ||
        projectName === "vangogh" ||
        projectName === "israels"
      ) {
        const tfFileId =
          projectName === "suriano"
            ? bodyId.replace("letter_body", "file")
            : bodyId.replace("letter_body", "letter");
        console.warn("Add suriano notes panel by " + tfFileId);
        const withNotes = await fetchBroccoliScanWithOverlap(
          tfFileId,
          ["tei:Note"],
          ["anno", "text"],
          "self",
          relativeTo,
          projectConfig,
          aborter.signal,
        );
        if (!withNotes) {
          return;
        }
        annotations.push(...withNotes.anno);
        views[NOTES_VIEW] = withNotes.views.self;
      }

      setStore({
        bodyId: result.request.bodyId,
        iiif: result.iiif,
      });
      setCurrentCanvas(result.iiif.canvasIds[0]);
      setAnnotations(annotations);
      setViews(views);

      setLoading(false);
      setInitDetail(true);
    }
  }, [isInitDetail]);

  return {
    isInitDetail: isInitDetail,
    isLoadingDetail: isLoading,
  };
}
