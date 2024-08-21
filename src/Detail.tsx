import { Skeleton } from "primereact/skeleton";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Annotation } from "./components/Annotations/annotation";
import { Footer } from "./components/Footer/Footer";
import { Mirador } from "./components/Mirador/Mirador";
import { TextComponent } from "./components/Text/TextComponent";
import { Broccoli } from "./model/Broccoli";
import { ProjectConfig } from "./model/ProjectConfig";
import { useAnnotationStore } from "./stores/annotation";
import { useProjectStore } from "./stores/project";
import { useSearchStore } from "./stores/search/search-store";
import { useTextStore } from "./stores/text";
import { fetchBroccoliScanWithOverlap } from "./utils/broccoli";
import { NOTES_VIEW } from "./components/Text/Annotated/FootnoteTooltip.tsx";

interface DetailProps {
  project: string;
  config: ProjectConfig;
}

export const Detail = (props: DetailProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showIiifViewer, setShowIiifViewer] = useState(true);
  const [showAnnotationPanel, setShowAnnotationPanel] = useState(
    props.config.defaultShowMetadataPanel,
  );
  const [broccoliResult, setBroccoliResult] = useState<Broccoli>();
  const setProjectName = useProjectStore((state) => state.setProjectName);
  const setAnnotations = useAnnotationStore((state) => state.setAnnotations);
  const setViews = useTextStore((state) => state.setViews);
  const annotationTypesToInclude = useAnnotationStore(
    (state) => state.annotationTypesToInclude,
  );
  const globalSearchResults = useSearchStore((state) => state.searchResults);
  const params = useParams();

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    setIsLoading(true);

    async function fetchBroccoli(bodyId: string) {
      const includeResults = ["anno", "iiif", "text"];

      const viewNames = props.config.allPossibleTextPanels.toString();

      const overlapTypes = annotationTypesToInclude;
      const relativeTo = "Origin";

      const result = await fetchBroccoliScanWithOverlap(
        bodyId,
        overlapTypes,
        includeResults,
        viewNames,
        relativeTo,
        props.config,
        signal,
      ).catch(handleAbort);

      if (!result) {
        return;
      }

      const annotations = result.anno;
      const views = result.views;

      if (props.project === "suriano") {
        const tfFileId = bodyId.replace("letter_body", "file");
        console.warn("Add suriano notes panel by " + tfFileId);
        const withNotes = await fetchBroccoliScanWithOverlap(
          tfFileId,
          ["tei:Note"],
          ["anno", "text"],
          "self",
          relativeTo,
          props.config,
          signal,
        );
        annotations.push(...withNotes.anno);
        views[NOTES_VIEW] = withNotes.views.self;
      }

      setBroccoliResult(result);

      setProjectName(props.project);
      setAnnotations(annotations);
      setViews(views);

      setIsLoading(false);
    }
    if (params.tier2) {
      const bodyId = params.tier2;
      fetchBroccoli(bodyId);
    }
    return () => controller.abort();
  }, [annotationTypesToInclude, params.tier2, props.config]);

  function showIiifViewerHandler() {
    setShowIiifViewer(!showIiifViewer);
  }

  function showAnnotationPanelHandler() {
    setShowAnnotationPanel(!showAnnotationPanel);
  }

  function showSearchResultsHandler() {
    setShowSearchResults(!showSearchResults);
  }

  return (
    <>
      {broccoliResult ? (
        <>
          <main className="mx-auto flex h-full w-full grow flex-row content-stretch items-stretch self-stretch">
            {showIiifViewer && props.config.showMirador ? (
              <Mirador broccoliResult={broccoliResult} />
            ) : null}
            <TextComponent
              panelsToRender={props.config.defaultTextPanels}
              allPossiblePanels={props.config.allPossibleTextPanels}
              isLoading={isLoading}
            />
            {showAnnotationPanel ? <Annotation isLoading={isLoading} /> : null}
          </main>
          <div>
            <Footer
              showIiifViewerHandler={showIiifViewerHandler}
              showAnnotationPanelHandler={showAnnotationPanelHandler}
              showSearchResultsHandler={showSearchResultsHandler}
              showSearchResultsDisabled={globalSearchResults === undefined}
              facsimileShowState={showIiifViewer}
              panelShowState={showAnnotationPanel}
              searchResultsShowState={showSearchResults}
            />
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-2 pl-2 pt-2">
          <Skeleton width="16rem" borderRadius="8px" className="h-4" />
          <Skeleton width="24rem" borderRadius="8px" className="h-4" />
          <Skeleton width="12rem" borderRadius="8px" className="h-4" />
        </div>
      )}
    </>
  );
};

function handleAbort(e: Error) {
  if (e instanceof DOMException && e.name == "AbortError") {
    console.debug("fetchBroccoliScanWithOverlap aborted by useEffect callback");
  } else {
    throw e;
  }
}
