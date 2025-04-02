import { Skeleton } from "primereact/skeleton";
import { useState } from "react";
import { Panels } from "./components/Detail/Panels.tsx";
import { useInitDetail } from "./components/Detail/useInitDetail.tsx";
import { Footer } from "./components/Footer/Footer";
import { useInitSearch } from "./components/Search/useInitSearch.ts";
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
  const { isInitDetail } = useInitDetail();

  useInitSearch();

  const { searchResults, isInitSearch } = useSearchStore();

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
            <Panels />
          </main>
          <Footer
            showIiifViewerHandler={showIiifViewerHandler}
            showAnnotationPanelHandler={showAnnotationPanelHandler}
            showSearchResultsHandler={showSearchResultsHandler}
            showSearchResultsDisabled={searchResults === undefined}
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
