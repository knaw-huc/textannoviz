import { useEffect, useState } from "react";
import { useAnnotationStore } from "../../stores/annotation.ts";
import {
  projectConfigSelector,
  useProjectStore,
} from "../../stores/project.ts";
import { useTextStore } from "../../stores/text/text-store.ts";
import { fetchBroccoliScanWithOverlap } from "../../utils/broccoli.ts";
import { handleAbort } from "../../utils/handleAbort.tsx";
// import { NOTES_VIEW } from "../Text/Annotated/MarkerTooltip.tsx";
import { useDetailNavigation } from "./useDetailNavigation.tsx";
import { useDetailViewStore } from "../../stores/detail-view/detail-view-store.ts";
import {
  AnnoRepoAnnotation,
  filterByBodyType,
  isNoteBody,
  NoteBody,
} from "../../model/AnnoRepoAnnotation.ts";
import { useLoadManifest } from "@knaw-huc/osd-iiif-viewer";

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

  const loadManifest = useLoadManifest();
  const { setAnnotations, setPtrToNoteAnnosMap, setBodyId } =
    useAnnotationStore();
  const setViews = useTextStore((state) => state.setViews);
  const setActivePanels = useDetailViewStore((state) => state.setActivePanels);

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

      //TODO: remove this code. However, this can only be removed if the footnotes of these projects are formatted in the same was as Israels
      if (projectName === "suriano") {
        const tfFileId =
          projectName === "suriano"
            ? bodyId.replace("letter_body", "file")
            : bodyId.replace("letter_body", "letter");
        console.warn("Add suriano notes panel by " + tfFileId);

        const withNotes = await fetchBroccoliScanWithOverlap(
          tfFileId,
          ["tei:Note", "tei:Hi", "tei:Rs", "tei:Ref"],
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
        // views[NOTES_VIEW] = withNotes.views.self;
      }
      if (result.iiif.manifest) {
        loadManifest(result.iiif.manifest, result.iiif.canvasIds[0]);
      }
      setAnnotations(annotations);
      setBodyId(result.request.bodyId);

      //TODO: Note anno type to project config
      if (annotations.some((anno) => anno.body.type === "Note")) {
        const ptrToNoteAnnos = new Map<string, AnnoRepoAnnotation<NoteBody>>();

        const noteAnnos = filterByBodyType(annotations, isNoteBody);
        noteAnnos
          //we only need 'notes' and 'langnotes'
          .filter((noteAnno) => noteAnno.body.subtype !== "typednotes")
          .forEach((noteAnno) => {
            const targetId = (noteAnno.body as NoteBody)["xml:id"];
            ptrToNoteAnnos.set(`#${targetId}`, noteAnno);
          });

        setPtrToNoteAnnosMap(new Map(ptrToNoteAnnos));
      }

      setViews(views);
      setActivePanels(projectConfig.detailPanels);

      setLoading(false);
      setInitDetail(true);
    }
  }, [isInitDetail]);

  return {
    isInitDetail: isInitDetail,
    isLoadingDetail: isLoading,
  };
}
