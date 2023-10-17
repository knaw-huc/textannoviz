import mirador from "mirador";
import React from "react";
import { useParams } from "react-router-dom";
import { Annotation } from "./components/Annotations/annotation";
import { Footer } from "./components/Footer";
import { Mirador } from "./components/Mirador/Mirador";
import { miradorConfig } from "./components/Mirador/MiradorConfig";
import { SearchItem } from "./components/Search/SearchItem";
import { TextComponent } from "./components/Text/TextComponent";
import { Broccoli, BroccoliBodyIdResult } from "./model/Broccoli";
import { ProjectConfig } from "./model/ProjectConfig";
import { SearchResultBody } from "./model/Search";
import { useAnnotationStore } from "./stores/annotation";
import { useMiradorStore } from "./stores/mirador";
import { useProjectStore } from "./stores/project";
import { useSearchStore } from "./stores/search";
import { useTextStore } from "./stores/text";
import {
  fetchBroccoliBodyIdOfScan,
  fetchBroccoliScanWithOverlap,
} from "./utils/broccoli";

interface DetailProps {
  project: string;
  config: ProjectConfig;
}

const setMiradorConfig = (broccoli: Broccoli, project: string) => {
  miradorConfig.windows[0].loadedManifest = broccoli.iiif.manifest;
  miradorConfig.windows[0].canvasId = broccoli.iiif.canvasIds[0];
  miradorConfig.windows[0].id = project;
};

export const Detail = (props: DetailProps) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [showSearchResults, setShowSearchResults] = React.useState(false);
  const [showIiifViewer, setShowIiifViewer] = React.useState(true);
  const [showAnnotationPanel, setShowAnnotationPanel] = React.useState(
    props.config.defaultShowMetadataPanel,
  );
  const [count, setCount] = React.useState(0);
  const setProjectName = useProjectStore((state) => state.setProjectName);

  const setStore = useMiradorStore((state) => state.setStore);
  const setCurrentContext = useMiradorStore((state) => state.setCurrentContext);
  const setCanvas = useMiradorStore((state) => state.setCanvas);
  const setAnnotations = useAnnotationStore((state) => state.setAnnotations);
  const setViews = useTextStore((state) => state.setViews);
  const annotationTypesToInclude = useAnnotationStore(
    (state) => state.annotationTypesToInclude,
  );
  const globalSearchResults = useSearchStore(
    (state) => state.globalSearchResults,
  );
  const params = useParams();

  React.useEffect(() => {
    if (showIiifViewer) {
      const viewer = mirador.viewer(miradorConfig);
      setStore(viewer.store);
    }
  }, [setStore, showIiifViewer]);

  const setState = React.useCallback(
    (broccoli: Broccoli, currentBodyId: string) => {
      setMiradorConfig(broccoli, props.project);
      console.log(broccoli);
      // let viewer: any;
      // if (count < 1) {
      //   viewer = mirador.viewer(miradorConfig);
      //   setStore(viewer.store);
      // }

      const viewer = mirador.viewer(miradorConfig);
      setStore(viewer.store);

      setProjectName(props.project);

      const newCanvas = {
        canvasIds: broccoli.iiif.canvasIds,
        currentIndex: 0,
      };

      setCanvas(newCanvas);

      const newCurrentContext = {
        tier0: params.tier0 as string,
        tier1: params.tier1 as string,
        bodyId: currentBodyId,
      };

      setCurrentContext(newCurrentContext);

      setAnnotations(broccoli.anno);
      setViews(broccoli.views);

      // if (params.tier2) {
      //   let annoToZoom: AnnoRepoAnnotation[];
      //   if (params.tier2.includes("resolution")) {
      //     annoToZoom = broccoli.anno.filter(
      //       (annotation) => annotation.body.type === "Resolution",
      //     );
      //   }

      //   if (params.tier2.includes("attendance_list")) {
      //     annoToZoom = broccoli.anno.filter(
      //       (annotation) => annotation.body.type === "AttendanceList",
      //     );
      //   }

      //   setTimeout(() => {
      //     const zoom = zoomAnnMirador(
      //       annoToZoom ? annoToZoom[0] : broccoli.anno[0],
      //       broccoli.iiif.canvasIds[0],
      //     );
      //     viewer.store.dispatch(
      //       mirador.actions.selectAnnotation(
      //         `${props.project}`,
      //         annoToZoom ? annoToZoom[0].id : broccoli.anno[0].id,
      //       ),
      //     );
      //     if (typeof zoom === "object") {
      //       viewer.store.dispatch(
      //         mirador.actions.updateViewport(`${props.project}`, {
      //           x: zoom?.zoomCenter.x,
      //           y: zoom?.zoomCenter.y,
      //           zoom: 1 / zoom!.miradorZoom,
      //         }),
      //       );
      //     }
      //   }, 200);
      // }
    },
    [
      params.tier0,
      params.tier1,
      props.project,
      setAnnotations,
      setCanvas,
      setCurrentContext,
      setProjectName,
      setStore,
      setViews,
    ],
  );

  React.useEffect(() => {
    let ignore = false;
    setIsLoading(true);
    setCount((prevState) => prevState + 1);
    if (params.tier0 && params.tier1) {
      fetchBroccoliBodyIdOfScan(params.tier0, params.tier1, props.config).then(
        (result: BroccoliBodyIdResult) => {
          if (!ignore) {
            const bodyId = result.bodyId;
            const includeResults = ["anno", "iiif", "text"];

            const views =
              typeof props.config.allPossibleTextPanels === "object"
                ? props.config.allPossibleTextPanels.toString()
                : "";

            const overlapTypes = annotationTypesToInclude;
            const relativeTo = props.config.relativeTo;

            fetchBroccoliScanWithOverlap(
              result.bodyId,
              overlapTypes,
              includeResults,
              views,
              relativeTo,
              props.config,
            ).then((broccoli: Broccoli) => {
              setState(broccoli, bodyId);
              setIsLoading(false);
            });
          }
        },
      );
    }
    return () => {
      ignore = true;
      setIsLoading(false);
    };
  }, [
    annotationTypesToInclude,
    params.tier0,
    params.tier1,
    props.config,
    setState,
  ]);

  React.useEffect(() => {
    setIsLoading(true);
    setCount((prevState) => prevState + 1);
    if (params.tier2) {
      const bodyId = params.tier2;
      const includeResults = ["anno", "iiif", "text"];

      const views =
        typeof props.config.allPossibleTextPanels === "object"
          ? props.config.allPossibleTextPanels.toString()
          : "";

      const overlapTypes = annotationTypesToInclude;
      const relativeTo = "Origin";

      fetchBroccoliScanWithOverlap(
        bodyId,
        overlapTypes,
        includeResults,
        views,
        relativeTo,
        props.config,
      )
        .then((broccoli: Broccoli) => {
          const bodyId = broccoli.request.bodyId;
          setState(broccoli, bodyId);
          setIsLoading(false);
        })
        .catch(console.error);
    }
  }, [annotationTypesToInclude, params.tier2, props.config, setState]);

  function nextOrPrevButtonClicked(clicked: boolean) {
    console.log(clicked);
    return clicked;
  }

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
      <div className="mx-auto flex h-full w-full grow flex-row content-stretch items-stretch self-stretch">
        {/* <div className="lastUpdated">
        Last updated: 17 July 2023{" "}
        {globalSearchResults && globalSearchResults.results.length >= 1 ? (
          <button onClick={() => setShowSearchResults(!showSearchResults)}>
            Show search results in side panel
          </button>
        ) : null}
      </div> */}
        <div className="h-full overflow-auto">
          {showSearchResults
            ? globalSearchResults && globalSearchResults.results.length >= 1
              ? globalSearchResults.results.map(
                  (result: SearchResultBody, index: number) => (
                    <SearchItem key={index} result={result} />
                  ),
                )
              : null
            : null}
        </div>

        {showIiifViewer ? <Mirador /> : null}
        <TextComponent
          panelsToRender={props.config.defaultTextPanels!}
          allPossiblePanels={props.config.allPossibleTextPanels!}
          isLoading={isLoading}
        />
        {showAnnotationPanel ? <Annotation isLoading={isLoading} /> : null}
      </div>
      <div>
        <Footer
          nextOrPrevButtonClicked={nextOrPrevButtonClicked}
          showIiifViewerHandler={showIiifViewerHandler}
          showAnnotationPanelHandler={showAnnotationPanelHandler}
          showSearchResultsHandler={showSearchResultsHandler}
          showSearchResultsDisabled={
            globalSearchResults === undefined ? true : false
          }
          facsimileShowState={showIiifViewer}
          panelShowState={showAnnotationPanel}
          searchResultsShowState={showSearchResults}
        />
      </div>
    </>
  );
};
