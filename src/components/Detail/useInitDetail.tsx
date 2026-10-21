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
import { useUrlSearchParamsStore } from "../Search/useSearchUrlParamsStore.ts";
import { createSearchRegex } from "../Text/createSearchRegex.tsx";
import {
  SearchHit,
  resolveSearchHits,
} from "../Text/Annotated/utils/resolveSearchHits.ts";
import { findDefaultSidebarTab } from "../Annotations/findDefaultSidebarTab.ts";

/**
 * Initialize views, annotations and iiif
 * 'Re-initialize' when tier2 changes
 */
export function useInitDetail() {
  const projectConfig = useProjectStore(projectConfigSelector);
  const { getDetailParams } = useDetailNavigation();

  const [isInitDetail, setInitDetail] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const loadManifest = useLoadManifest();
  const { setAnnotations, setPtrToNoteAnnosMap, setBodyId } =
    useAnnotationStore();
  const setViews = useTextStore((state) => state.setViews);
  const annotations = useAnnotationStore((state) => state.annotations);
  const views = useTextStore((state) => state.views);
  const terms = useUrlSearchParamsStore((state) => state.searchQuery.terms);
  const fullText = useUrlSearchParamsStore(
    (state) => state.searchQuery.fullText,
  );
  const isInitSearchUrlParams = useUrlSearchParamsStore(
    (state) => state.isInitSearchUrlParams,
  );
  const setSearchHits = useTextStore((state) => state.setSearchHits);
  const resetSearchHits = useTextStore((state) => state.resetSearchHits);
  const setActivePanels = useDetailViewStore((state) => state.setActivePanels);
  const resetPanelVisibilityOverrides = useDetailViewStore(
    (state) => state.resetPanelVisibilityOverrides,
  );
  const setActiveSidebarTab = useDetailViewStore(
    (state) => state.setActiveSidebarTab,
  );
  const resetActiveFootnote = useTextStore(
    (state) => state.resetActiveFootnote,
  );

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
      // Overrides are a one-off "show this now" for the letter at hand: clear
      // them per letter, before anything can reveal a panel in the new one.
      // The same goes for the selected note.
      resetPanelVisibilityOverrides();
      resetActiveFootnote();
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
      if (result.iiif.manifest) {
        loadManifest(result.iiif.manifest, result.iiif.canvasIds[0]);
      }
      setAnnotations(annotations);
      setBodyId(result.request.bodyId);
      // Open the default tab of the new page; a note or search hit to reveal
      // selects its own tab once the page is initialized
      setActiveSidebarTab(findDefaultSidebarTab(projectConfig, annotations));

      //TODO: Note anno type to project config
      // Set even when empty: the url hash is matched against it, so a letter
      // without notes must not keep the previous letter's
      const ptrToNoteAnnos = new Map<string, AnnoRepoAnnotation<NoteBody>>();
      filterByBodyType(annotations, isNoteBody)
        //we only need 'notes' and 'langnotes'
        .filter((noteAnno) => noteAnno.body.subtype !== "typednotes")
        .forEach((noteAnno) => {
          const targetId = (noteAnno.body as NoteBody)["xml:id"];
          ptrToNoteAnnos.set(`#${targetId}`, noteAnno);
        });
      setPtrToNoteAnnosMap(ptrToNoteAnnos);

      setViews(views);
      setActivePanels(projectConfig.detailPanels);

      setLoading(false);
      setInitDetail(true);
    }
  }, [isInitDetail]);

  /**
   * Collect every match of the search in this letter — entities matching the
   * selected facets and full-text hits — so the detail view can list them and
   * reveal the first.
   *
   * Kept apart from {@link initDetail}, as its inputs arrive independently: on
   * a page load the search terms are only read from the url once the default
   * query is in, which can be after the letter has loaded. Waits for both, and
   * reruns whenever either changes. Cleared when nothing matches, so a letter
   * without matches does not inherit the previous one's list.
   */
  useEffect(() => {
    const locations = projectConfig.searchHitLocations;
    if (!locations || !isInitDetail || !isInitSearchUrlParams) {
      return;
    }

    let matches: SearchHit[] = [];
    try {
      matches = resolveSearchHits(
        annotations,
        views,
        terms,
        projectConfig,
        locations,
        // The regex the text is highlighted with, so the list matches it
        createSearchRegex(fullText, tier2),
      );
    } catch (error) {
      // Revealing matches is an enhancement: an unexpected annotation shape
      // should cost the reader the scroll, not the letter.
      console.error("Could not resolve entity matches", error);
    }

    if (matches.length) {
      setSearchHits(matches);
    } else {
      resetSearchHits();
    }
  }, [
    isInitDetail,
    isInitSearchUrlParams,
    annotations,
    views,
    terms,
    fullText,
    tier2,
    projectConfig,
    setSearchHits,
    resetSearchHits,
  ]);

  return {
    isInitDetail: isInitDetail,
    isLoadingDetail: isLoading,
  };
}
