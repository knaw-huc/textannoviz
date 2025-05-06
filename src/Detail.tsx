import { Skeleton } from "primereact/skeleton";
import { useState } from "react";
// import { Panels } from "./components/Detail/Panels.tsx";
import { useInitDetail } from "./components/Detail/useInitDetail.tsx";
import { Footer } from "./components/Footer/Footer";
import { useInitSearch } from "./components/Search/useInitSearch.ts";
import { ProjectConfig } from "./model/ProjectConfig";
import { useSearchStore } from "./stores/search/search-store";
import { Annotation } from "./components/Annotations/Annotation.tsx";
import { Mirador } from "./components/Mirador/Mirador.tsx";
import { TextComponent } from "./components/Text/TextComponent.tsx";

interface DetailProps {
  project: string;
  config: ProjectConfig;
}

export const Detail = (props: DetailProps) => {
  const [showAnnotationPanel, setShowAnnotationPanel] = useState(
    props.config.defaultShowMetadataPanel,
  );
  const { isInitDetail, isLoadingDetail } = useInitDetail();

  useInitSearch();

  const { isInitSearch } = useSearchStore();

  function showAnnotationPanelHandler() {
    setShowAnnotationPanel(!showAnnotationPanel);
  }

  return (
    <>
      {isInitDetail && isInitSearch ? (
        <>
          <main
            className="mx-auto grid w-full grow overflow-y-scroll"
            style={{
              gridTemplateColumns:
                "minmax(550px, auto) minmax(300px, 650px) minmax(300px, 400px)",
              justifyContent: "stretch",
            }}
          >
            {props.config.showMirador ? <Mirador /> : null}
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
            showAnnotationPanelHandler={showAnnotationPanelHandler}
            panelShowState={showAnnotationPanel}
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
