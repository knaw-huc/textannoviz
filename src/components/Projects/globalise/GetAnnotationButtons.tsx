import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import mirador from "mirador";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { PxPageBody } from "../../../model/AnnoRepoAnnotation";
import { useAnnotationStore } from "../../../stores/annotation";
import { useMiradorStore } from "../../../stores/mirador";

export const GetAnnotationButtons = () => {
  const miradorStore = useMiradorStore((state) => state.miradorStore);
  const annotations = useAnnotationStore((state) => state.annotations);
  const params = useParams();
  const navigate = useNavigate();

  const pageAnnotation = annotations.find(
    (annotation) => annotation.body.type === "px:Page",
  );

  const nextCanvasClickHandler = () => {
    const nextPage = (pageAnnotation?.body as PxPageBody).metadata.nextPageId;

    if (nextPage === undefined)
      return toast("You have reached the last page.", { type: "info" });
    navigate(`/detail/${nextPage}`);
    miradorStore.dispatch(mirador.actions.setNextCanvas("globalise"));
  };

  const previousCanvasClickHandler = () => {
    const prevPage = (pageAnnotation?.body as PxPageBody).metadata.prevPageId;

    if (prevPage === undefined)
      return toast("You have reached the first page.", { type: "info" });

    navigate(`/detail/${prevPage}`);
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
            <ChevronLeftIcon className="h-4 w-4 fill-neutral-500" /> Previous
            page
          </button>
          <button
            className="hover:text-brand1-600 active:text-brand1-700 flex flex-row items-center gap-1 py-1 pr-10"
            onClick={nextCanvasClickHandler}
          >
            Next page <ChevronRightIcon className="h-4 w-4 fill-neutral-500" />
          </button>
        </>
      ) : null}
    </>
  );
};
