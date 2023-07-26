import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import mirador from "mirador";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useMiradorStore } from "../../../stores/mirador";
import { globaliseConfig } from "./config";

export const GetAnnotationButtons = () => {
  const miradorStore = useMiradorStore((state) => state.miradorStore);
  const currentContext = useMiradorStore((state) => state.currentContext);
  const params = useParams();
  const navigate = useNavigate();

  const documentIndices = globaliseConfig.documents?.find(
    (document) => currentContext.tier0 === document.docNr,
  );

  if (!documentIndices) return null;

  const indices = documentIndices.index;

  const nextCanvasClickHandler = () => {
    const currentIndex = indices.indexOf(parseInt(currentContext.tier1));
    const nextCanvas = indices[currentIndex + 1];
    if (!indices.includes(nextCanvas)) {
      toast(
        `Opening ${indices[currentIndex] + 1} does not exist in document ${
          currentContext.tier0
        }!`,
        { type: "error" },
      );
      return;
    }
    const document = currentContext.tier0;

    navigate(`/detail/${document}/${nextCanvas.toString()}`);
    miradorStore.dispatch(mirador.actions.setNextCanvas("globalise"));

    console.log(miradorStore.getState());
  };

  const previousCanvasClickHandler = () => {
    const currentIndex = indices.indexOf(parseInt(currentContext.tier1));
    const prevCanvas = indices[currentIndex - 1];
    if (!indices.includes(prevCanvas)) {
      toast(
        `Opening ${indices[currentIndex] - 1} does not exist in document ${
          currentContext.tier0
        }!`,
        { type: "error" },
      );
      return;
    }

    const document = currentContext.tier0;

    navigate(`/detail/${document}/${prevCanvas.toString()}`);
    miradorStore.dispatch(mirador.actions.setPreviousCanvas("globalise"));
  };

  return (
    <>
      {params.tier0 && params.tier1 ? (
        <>
          <button
            className="hover:text-brand1-600 active:text-brand1-700 flex flex-row items-center gap-1 py-1 pl-16"
            onClick={previousCanvasClickHandler}
          >
            <ChevronLeftIcon className="h-4 w-4 fill-neutral-500" /> Previous
            canvas
          </button>
          <button
            className="hover:text-brand1-600 active:text-brand1-700 flex flex-row items-center gap-1 py-1 pr-10"
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
