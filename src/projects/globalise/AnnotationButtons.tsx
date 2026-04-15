import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { useParams } from "react-router";
import { toast } from "../../utils/toast.ts";
import { PxPageBody } from "../../model/AnnoRepoAnnotation";
import { useAnnotationStore } from "../../stores/annotation";
import { useCanvas } from "@knaw-huc/osd-iiif-viewer";
import { useDetailNavigation } from "../../components/Detail/useDetailNavigation.tsx";
import { useTranslate } from "../../stores/project.ts";

export const AnnotationButtons = () => {
  const { next, prev } = useCanvas();
  const annotations = useAnnotationStore((state) => state.annotations);
  const params = useParams();
  const { navigateDetail } = useDetailNavigation();
  const translate = useTranslate();

  const pageAnnotation = annotations.find(
    (annotation) => annotation.body.type === "px:Page",
  );

  const nextCanvasClickHandler = () => {
    const nextPage = (pageAnnotation?.body as PxPageBody).metadata.nextPageId;

    if (nextPage === undefined)
      return toast(translate("INFO_LAST_PAGE"), { type: "info" });
    navigateDetail(`/detail/${nextPage}`);
    next();
  };

  const previousCanvasClickHandler = () => {
    const prevPage = (pageAnnotation?.body as PxPageBody).metadata.prevPageId;

    if (prevPage === undefined)
      return toast(translate("INFO_FIRST_PAGE"), { type: "info" });

    navigateDetail(`/detail/${prevPage}`);
    prev();
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
