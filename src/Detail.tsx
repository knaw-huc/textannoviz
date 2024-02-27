import mirador from "mirador";
import React from "react";
import { useParams } from "react-router-dom";
import { Annotation } from "./components/Annotations/annotation";
import { Footer } from "./components/Footer";
import { Mirador } from "./components/Mirador/Mirador";
import { defaultMiradorConfig } from "./components/Mirador/defaultMiradorConfig.ts";
import { SearchItem } from "./components/Search/SearchItem";
import { TextComponent } from "./components/Text/TextComponent";
import { Broccoli, BroccoliBodyIdResult } from "./model/Broccoli";
import { MiradorConfig } from "./model/MiradorConfig.ts";
import { ProjectConfig } from "./model/ProjectConfig";
import {
  GlobaliseSearchResultsBody,
  MondriaanSearchResultsBody,
  RepublicSearchResultBody,
  TranslatinSearchResultsBody,
} from "./model/Search";
import { useAnnotationStore } from "./stores/annotation";
import { useMiradorStore } from "./stores/mirador";
import { useProjectStore } from "./stores/project";
import { useSearchStore } from "./stores/search/search-store";
import { useTextStore } from "./stores/text";
import {
  fetchBroccoliBodyIdOfScan,
  fetchBroccoliScanWithOverlap,
} from "./utils/broccoli";
import { zoomAnnMirador } from "./utils/zoomAnnMirador.ts";

interface DetailProps {
  project: string;
  config: ProjectConfig;
}

const createMiradorConfig = (
  broccoli: Broccoli,
  project: ProjectConfig,
  config: MiradorConfig = defaultMiradorConfig,
) => {
  const newConfig = config;
  newConfig.windows[0].manifestId = broccoli.iiif.manifest;
  newConfig.windows[0].canvasId = broccoli.iiif.canvasIds[0];
  newConfig.windows[0].id = project.id;
  newConfig.window.allowWindowSideBar = project.mirador.showWindowSideBar;
  newConfig.window.allowTopMenuButton = project.mirador.showTopMenuButton;
  return newConfig;
};

export const Detail = (props: DetailProps) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [showSearchResults, setShowSearchResults] = React.useState(false);
  const [showIiifViewer, setShowIiifViewer] = React.useState(true);
  const [showAnnotationPanel, setShowAnnotationPanel] = React.useState(
    props.config.defaultShowMetadataPanel,
  );
  const setProjectName = useProjectStore((state) => state.setProjectName);

  const setMiradorStore = useMiradorStore((state) => state.setStore);
  const setCurrentContext = useMiradorStore((state) => state.setCurrentContext);
  const setCanvas = useMiradorStore((state) => state.setCanvas);
  const setAnnotations = useAnnotationStore((state) => state.setAnnotations);
  const setViews = useTextStore((state) => state.setViews);
  const annotationTypesToInclude = useAnnotationStore(
    (state) => state.annotationTypesToInclude,
  );
  const globalSearchResults = useSearchStore((state) => state.searchResults);
  const params = useParams();

  const createDetailState = React.useCallback(
    (broccoli: Broccoli, currentBodyId: string) => {
      const miradorConfig = createMiradorConfig(broccoli, props.config);
      if (showIiifViewer) {
        const viewer = mirador.viewer(miradorConfig);
        setMiradorStore(viewer.store);

        if (props.config.zoomAnnoMirador) {
          if (params.tier2) {
            const annoToZoom = broccoli.anno.find(
              (annotation) => annotation.body.id === params.tier2,
            );

            if (annoToZoom) {
              viewer.store.dispatch(
                mirador.actions.selectAnnotation(
                  `${props.project}`,
                  annoToZoom.body.id,
                ),
              );
              const zoom = zoomAnnMirador(
                annoToZoom ? annoToZoom : broccoli.anno[0],
                broccoli.iiif.canvasIds[0],
              );

              const id = setInterval(() => {
                if (zoom) {
                  if (
                    typeof viewer.store.getState().viewers[props.project].x ===
                    "number"
                  ) {
                    viewer.store.dispatch(
                      mirador.actions.updateViewport(`${props.project}`, {
                        x: zoom.zoomCenter.x,
                        y: zoom.zoomCenter.y,
                        zoom: 1 / zoom.miradorZoom,
                      }),
                    );
                    clearInterval(id);
                  }
                }
              }, 50);
            }
          }
        }
      }

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
    },
    [
      params.tier0,
      params.tier1,
      params.tier2,
      props.project,
      setAnnotations,
      setCanvas,
      setCurrentContext,
      setProjectName,
      setMiradorStore,
      setViews,
    ],
  );

  React.useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    setIsLoading(true);
    if (params.tier0 && params.tier1) {
      fetchBroccoliBodyIdOfScan(
        params.tier0,
        params.tier1,
        props.config,
        signal,
      ).then((result: BroccoliBodyIdResult) => {
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
          signal,
        ).then((broccoli: Broccoli) => {
          createDetailState(broccoli, bodyId);
          setIsLoading(false);
        });
      });
    }
    return () => {
      controller.abort();
      setIsLoading(false);
    };
  }, [
    annotationTypesToInclude,
    params.tier0,
    params.tier1,
    props.config,
    createDetailState,
  ]);

  React.useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    setIsLoading(true);
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
        signal,
      )
        .then((broccoli: Broccoli) => {
          const bodyId = broccoli.request.bodyId;
          createDetailState(broccoli, bodyId);
          setIsLoading(false);
        })
        .catch(console.error);
    }
    return () => {
      controller.abort();
    };
  }, [annotationTypesToInclude, params.tier2, props.config, createDetailState]);

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
        <div className="h-full overflow-auto">
          {showSearchResults
            ? globalSearchResults && globalSearchResults.results.length >= 1
              ? globalSearchResults.results.map(
                  (
                    result:
                      | RepublicSearchResultBody
                      | TranslatinSearchResultsBody
                      | MondriaanSearchResultsBody
                      | GlobaliseSearchResultsBody,
                    index: number,
                  ) => <SearchItem key={index} result={result} />,
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
          showSearchResultsDisabled={globalSearchResults === undefined}
          facsimileShowState={showIiifViewer}
          panelShowState={showAnnotationPanel}
          searchResultsShowState={showSearchResults}
        />
      </div>
    </>
  );
};
