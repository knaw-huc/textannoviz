import { ViewerProvider } from "@knaw-huc/osd-iiif-viewer";
import { useInitDetail } from "./components/Detail/useInitDetail.tsx";
import { Footer } from "./components/Footer/Footer";
import { useInitSearch } from "./components/Search/useInitSearch.ts";
import { useSearchStore } from "./stores/search/search-store";
import { Panels } from "./components/Detail/Panels.tsx";
import { useDetailViewStore } from "./stores/detail-view/detail-view-store";
import { projectConfigSelector, useProjectStore } from "./stores/project";
import { SkeletonLoader } from "./components/common/SkeletonLoader.tsx";

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
        <SkeletonLoader />
      )}
    </>
  );
}
