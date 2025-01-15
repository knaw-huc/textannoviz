import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import mirador from "mirador-knaw-huc-mui5";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { PxPageBody } from "../../model/AnnoRepoAnnotation";
import { useAnnotationStore } from "../../stores/annotation";
import { useInternalMiradorStore } from "../../stores/internal-mirador.ts";
import { translateSelector, useProjectStore } from "../../stores/project.ts";
import { useDetailNavigation } from "../../components/Text/Annotated/utils/useDetailNavigation.tsx";

export const AnnotationButtons = () => {
  const miradorStore = useInternalMiradorStore((state) => state.miradorStore);
  const annotations = useAnnotationStore((state) => state.annotations);
  const params = useParams();
  const { navigateDetail } = useDetailNavigation();
  const translate = useProjectStore(translateSelector);

  const pageAnnotation = annotations.find(
    (annotation) => annotation.body.type === "px:Page",
  );

  const nextCanvasClickHandler = () => {
    const nextPage = (pageAnnotation?.body as PxPageBody).metadata.nextPageId;

    if (nextPage === undefined)
      return toast(translate("INFO_LAST_PAGE"), { type: "info" });
    navigateDetail(`/detail/${nextPage}`);
    miradorStore.dispatch(mirador.actions.setNextCanvas("globalise"));
  };

  const previousCanvasClickHandler = () => {
    const prevPage = (pageAnnotation?.body as PxPageBody).metadata.prevPageId;

    if (prevPage === undefined)
      return toast(translate("INFO_FIRST_PAGE"), { type: "info" });

    navigateDetail(`/detail/${prevPage}`);
    miradorStore.dispatch(mirador.actions.setPreviousCanvas("globalise"));
  };

  return (
    <>
      {params.tier2 ? (
        <>
          <button
            className="hover:text-brand1-600 active:text-brand1-700 flex flex-row items-center gap-1 py-1 pl-16"
            onClick={previousCanvasClickHandler}
          >
            <ChevronLeftIcon className="h-4 w-4 fill-neutral-500" />{" "}
            {translate("PREV_PAGE")}
          </button>
          <button
            className="hover:text-brand1-600 active:text-brand1-700 flex flex-row items-center gap-1 py-1 pr-10"
            onClick={nextCanvasClickHandler}
          >
            {translate("NEXT_PAGE")}{" "}
            <ChevronRightIcon className="h-4 w-4 fill-neutral-500" />
          </button>
        </>
      ) : null}
    </>
  );
};
