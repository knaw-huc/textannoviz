import { Skeleton } from "@nextui-org/react";
import React from "react";
import { useParams } from "react-router-dom";
import { Annotation } from "./components/Annotations/annotation";
import { Footer } from "./components/Footer";
import { Mirador } from "./components/Mirador/Mirador";
import { TextComponent } from "./components/Text/TextComponent";
import { Broccoli } from "./model/Broccoli";
import { ProjectConfig } from "./model/ProjectConfig";
import { useAnnotationStore } from "./stores/annotation";
import { useProjectStore } from "./stores/project";
import { useSearchStore } from "./stores/search/search-store";
import { useTextStore } from "./stores/text";
import { fetchBroccoliScanWithOverlap } from "./utils/broccoli";

interface DetailProps {
  project: string;
  config: ProjectConfig;
}

export const Detail = (props: DetailProps) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [showSearchResults, setShowSearchResults] = React.useState(false);
  const [showIiifViewer, setShowIiifViewer] = React.useState(true);
  const [showAnnotationPanel, setShowAnnotationPanel] = React.useState(
    props.config.defaultShowMetadataPanel,
  );
  const [broccoliResult, setBroccoliResult] = React.useState<Broccoli>();
  const setProjectName = useProjectStore((state) => state.setProjectName);
  const setAnnotations = useAnnotationStore((state) => state.setAnnotations);
  const setViews = useTextStore((state) => state.setViews);
  const annotationTypesToInclude = useAnnotationStore(
    (state) => state.annotationTypesToInclude,
  );
  const globalSearchResults = useSearchStore((state) => state.searchResults);
  const params = useParams();

  React.useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    setIsLoading(true);

    async function fetchBroccoli(bodyId: string) {
      const includeResults = ["anno", "iiif", "text"];

      const views = props.config.allPossibleTextPanels.toString();

      const overlapTypes = annotationTypesToInclude;
      const relativeTo = "Origin";

      const result = await fetchBroccoliScanWithOverlap(
        bodyId,
        overlapTypes,
        includeResults,
        views,
        relativeTo,
        props.config,
        signal,
      );

      setBroccoliResult(result);

      setProjectName(props.project);
      setAnnotations(result.anno);
      setViews(result.views);

      setIsLoading(false);
    }

    if (params.tier2) {
      const bodyId = params.tier2;
      fetchBroccoli(bodyId);
    }
    return () => {
      controller.abort();
    };
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
          <Skeleton className="h-4 w-64 rounded-lg" />
          <Skeleton className="h-4 w-96 rounded-lg" />
          <Skeleton className="h-4 w-48 rounded-lg" />
        </div>
      )}
    </>
  );
};
