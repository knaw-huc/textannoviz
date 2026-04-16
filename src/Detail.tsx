import { Skeleton } from "primereact/skeleton";
import { ViewerProvider } from "@knaw-huc/osd-iiif-viewer";
import { useInitDetail } from "./components/Detail/useInitDetail.tsx";
import { Footer } from "./components/Footer/Footer";
import { useInitSearch } from "./components/Search/useInitSearch.ts";
import { useSearchStore } from "./stores/search/search-store";
import { Panels } from "./components/Detail/Panels.tsx";
import { useDetailViewStore } from "./stores/detail-view/detail-view-store";
import { projectConfigSelector, useProjectStore } from "./stores/project";

export const Detail = () => {
  return (
    <ViewerProvider>
      <DetailWithViewer />
    </ViewerProvider>
  );
};

function DetailWithViewer() {
  const { isInitDetail } = useInitDetail();
  useInitSearch();
  const { isInitSearch } = useSearchStore();
  const { activePanels } = useDetailViewStore();
  const projectConfig = useProjectStore(projectConfigSelector);

  const gridTemplateColumns = projectConfig.detailPanels
    .filter((_, index) => activePanels[index]?.visible)
    .map((panel) => panel.size)
    .join(" ");

  return (
    <>
      {isInitDetail && isInitSearch ? (
        <>
          <main
            id="panelsContainer"
            className="mx-auto grid w-full grow justify-center overflow-y-scroll"
            style={{ gridTemplateColumns }}
          >
            <Panels />
          </main>
          <Footer />
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
}
