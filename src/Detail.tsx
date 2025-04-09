import { useState } from "react";
import { Annotation } from "./components/Annotations/Annotation.tsx";
import { Footer } from "./components/Footer/Footer";
import { Mirador } from "./components/Mirador/Mirador";
import { TextComponent } from "./components/Text/TextComponent";
import { ProjectConfig } from "./model/ProjectConfig";
import { useSearchStore } from "./stores/search/search-store";
import { useInitDetail } from "./components/Detail/useInitDetail.tsx";
import { useInitSearch } from "./components/Search/useInitSearch.ts";

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
            {showIiifViewer && props.config.showMirador ? <Mirador /> : null}
            <TextComponent
              panelsToRender={props.config.defaultTextPanels}
              allPossiblePanels={props.config.allPossibleTextPanels}
              isLoading={isLoadingDetail}
            />
            {showAnnotationPanel ? (
              <Annotation isLoading={isLoadingDetail} />
            ) : null}
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
        <div className="flex flex-col gap-2 pl-4 pt-4">
          <div className="grid w-1/5 animate-pulse gap-2">
            <div className="col-span-6 h-4 rounded-xl bg-gray-200"></div>
            <div className="col-span-8 h-4 rounded-xl bg-gray-200"></div>
            <div className="col-span-4 h-4 rounded-xl bg-gray-200"></div>
          </div>
        </div>
      )}
    </>
  );
};
