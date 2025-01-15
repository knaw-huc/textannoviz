import { fetchBroccoliScanWithOverlap } from "../../utils/broccoli.ts";
import { useEffect, useState } from "react";
import {
  projectConfigSelector,
  useProjectStore,
} from "../../stores/project.ts";
import { handleAbort } from "../../utils/handleAbort.tsx";
import { NOTES_VIEW } from "../Text/Annotated/MarkerTooltip.tsx";
import { useDetailNavigate } from "../Text/Annotated/utils/useDetailNavigate.tsx";
import { useAnnotationStore } from "../../stores/annotation.ts";
import { useTextStore } from "../../stores/text.ts";
import { useMiradorStore } from "../../stores/mirador.ts";

/**
 * Initialize views, annotations and iiif
 * 'Re-initialize' when tier2 changes
 */
export function useInitDetail() {
  const projectConfig = useProjectStore(projectConfigSelector);
  const { projectName } = useProjectStore();
  const { getDetailUrlParams } = useDetailNavigate();

  const [isInitDetail, setInitDetail] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const { setStore } = useMiradorStore();
  const { setAnnotations } = useAnnotationStore();
  const { setViews } = useTextStore();

  const { tier2 } = useDetailNavigate().getDetailUrlParams();
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
      const { tier2 } = getDetailUrlParams();
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

      if (projectName === "suriano") {
        const tfFileId = bodyId.replace("letter_body", "file");
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
