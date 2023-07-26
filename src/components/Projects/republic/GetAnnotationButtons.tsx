import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import mirador from "mirador";
import { useNavigate, useParams } from "react-router-dom";
import { useAnnotationStore } from "../../../stores/annotation";
import { useMiradorStore } from "../../../stores/mirador";

export const GetAnnotationButtons = () => {
  const currentContext = useMiradorStore((state) => state.currentContext);
  const miradorStore = useMiradorStore((state) => state.miradorStore);
  const resetOpenAnn = useAnnotationStore((state) => state.resetOpenAnn);
  const params = useParams();
  const navigate = useNavigate();

  const nextCanvasClickHandler = () => {
    resetOpenAnn();
    const nextCanvas = parseInt(currentContext.tier1) + 1;
    const volume = currentContext.tier0;

    navigate(`/detail/${volume}/${nextCanvas.toString()}`);
    miradorStore.dispatch(mirador.actions.setNextCanvas("republic"));
  };

  const previousCanvasClickHandler = () => {
    resetOpenAnn();
    const prevCanvas = parseInt(currentContext.tier1) - 1;
    const volume = currentContext.tier0;

    navigate(`/detail/${volume}/${prevCanvas.toString()}`);
    miradorStore.dispatch(mirador.actions.setPreviousCanvas("republic"));
  };

  return (
    <>
      {params.tier0 && params.tier1 ? (
        <>
          <button
            className="hover:text-brand1-600 flex flex-row items-center gap-1 py-1 pl-16 text-neutral-500"
            onClick={previousCanvasClickHandler}
          >
            <ChevronLeftIcon className="h-4 w-4 fill-neutral-500" /> Previous
            canvas
          </button>
          <button
            className="hover:text-brand1-600 flex flex-row items-center gap-1 py-1 pr-10 text-neutral-500"
            onClick={nextCanvasClickHandler}
          >
            Next canvas{" "}
            <ChevronRightIcon className="h-4 w-4 fill-neutral-500" />
          </button>
        </>
      ) : null}
    </>
  );
};
