import { Skeleton } from "primereact/skeleton";
// import { Panels } from "./components/Detail/Panels.tsx";
import { useInitDetail } from "./components/Detail/useInitDetail.tsx";
import { Footer } from "./components/Footer/Footer";
import { useInitSearch } from "./components/Search/useInitSearch.ts";
// import { ProjectConfig } from "./model/ProjectConfig";
import { useSearchStore } from "./stores/search/search-store";
// import { Annotation } from "./components/Annotations/Annotation.tsx";
// import { Mirador } from "./components/Mirador/Mirador.tsx";
// import { TextComponent } from "./components/Text/TextComponent.tsx";
import { Panels } from "./components/Detail/Panels.tsx";

// interface DetailProps {
//   project: string;
//   config: ProjectConfig;
// }

export const Detail = () => {
  const { isInitDetail } = useInitDetail();

  useInitSearch();

  const { isInitSearch } = useSearchStore();

  return (
    <>
      {isInitDetail && isInitSearch ? (
        <>
          <main
            id="panelsContainer"
            className="mx-auto grid w-full grow overflow-y-scroll"
            style={{
              gridTemplateColumns:
                "minmax(550px, auto) minmax(300px, 650px) minmax(300px, 650px) minmax(300px, 400px)",
              justifyContent: "stretch",
            }}
          >
            {/* {props.config.showMirador ? <Mirador /> : null}
            <TextComponent
              viewToRender={props.config.defaultTextPanels}
              isLoading={isLoadingDetail}
            />
            <Annotation isLoading={isLoadingDetail} /> */}
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
};
