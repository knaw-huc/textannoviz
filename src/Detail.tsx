import { Skeleton } from "primereact/skeleton";
import { useState } from "react";
import { Annotation } from "./components/Annotations/Annotation.tsx";
import { Footer } from "./components/Footer/Footer";
// import { Mirador } from "./components/Mirador/Mirador";
import { Panel } from "./components/Detail/Panel.tsx";
import { useInitDetail } from "./components/Detail/useInitDetail.tsx";
import { useInitSearch } from "./components/Search/useInitSearch.ts";
// import { TextComponent } from "./components/Text/TextComponent";
import { ProjectConfig } from "./model/ProjectConfig";
import { useSearchStore } from "./stores/search/search-store";

interface DetailProps {
  project: string;
  config: ProjectConfig;
}

export const Detail = (props: DetailProps) => {
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showIiifViewer, setShowIiifViewer] = useState(true);
  const [showAnnotationPanel, setShowAnnotationPanel] = useState(
    props.config.defaultShowMetadataPanel,
  );
  const { isInitDetail, isLoadingDetail } = useInitDetail();
  const { isInitSearch } = useInitSearch();

  const globalSearchResults = useSearchStore((state) => state.searchResults);

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
      {isInitDetail && isInitSearch ? (
        <>
          <main className="mx-auto flex h-full w-full grow flex-row content-stretch items-stretch self-stretch">
            <Panel />
            {/* {showIiifViewer && props.config.showMirador ? <Mirador /> : null} */}
            {/* <TextComponent
              panelsToRender={props.config.defaultTextPanels}
              allPossiblePanels={props.config.allPossibleTextPanels}
              isLoading={isLoadingDetail}
            /> */}
            {showAnnotationPanel ? (
              <Annotation isLoading={isLoadingDetail} />
            ) : null}
          </main>
          <Footer
            showIiifViewerHandler={showIiifViewerHandler}
            showAnnotationPanelHandler={showAnnotationPanelHandler}
            showSearchResultsHandler={showSearchResultsHandler}
            showSearchResultsDisabled={globalSearchResults === undefined}
            facsimileShowState={showIiifViewer}
            panelShowState={showAnnotationPanel}
            searchResultsShowState={showSearchResults}
          />
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
