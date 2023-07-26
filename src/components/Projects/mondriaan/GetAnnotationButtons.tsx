import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import mirador from "mirador";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAnnotationStore } from "../../../stores/annotation";
import { useMiradorStore } from "../../../stores/mirador";
import { mondriaanConfig } from "./config";

interface GetAnnotationButtonsProps {
  nextOrPrevButtonClicked: (clicked: boolean) => boolean;
}

export const GetAnnotationButtons = (props: GetAnnotationButtonsProps) => {
  const miradorStore = useMiradorStore((state) => state.miradorStore);
  const currentContext = useMiradorStore((state) => state.currentContext);
  const resetOpenAnn = useAnnotationStore((state) => state.resetOpenAnn);
  const setCurrentSelectedAnn = useAnnotationStore(
    (state) => state.setCurrentSelectedAnn,
  );
  const params = useParams();
  const navigate = useNavigate();

  const letters = mondriaanConfig.letters;

  const nextCanvasClickHandler = () => {
    props.nextOrPrevButtonClicked(true);
    setCurrentSelectedAnn("");
    resetOpenAnn();
    if (!letters) return;
    const currentIndex = letters?.indexOf(currentContext.tier1);
    const nextCanvas = letters[currentIndex + 1];
    if (!nextCanvas) {
      toast(`This is the last letter in folder ${currentContext.tier0}!`, {
        type: "error",
      });
      return;
    }

    const folder = currentContext?.tier0;

    navigate(`/detail/${folder}/${nextCanvas}`);
    miradorStore.dispatch(mirador.actions.setNextCanvas("mondriaan"));
  };

  const prevCanvasClickHandler = () => {
    props.nextOrPrevButtonClicked(true);
    setCurrentSelectedAnn("");
    resetOpenAnn();
    if (!letters) return;
    const currentIndex = letters.indexOf(currentContext.tier1);
    const prevCanvas = letters[currentIndex - 1];
    if (!prevCanvas) {
      toast(`This is the first letter in folder ${currentContext.tier0}!`, {
        type: "error",
      });
      return;
    }

    const folder = currentContext?.tier0;

    navigate(`/detail/${folder}/${prevCanvas}`);
    miradorStore.dispatch(mirador.actions.setNextCanvas("mondriaan"));
  };

  return (
    <>
      {params.tier0 && params.tier1 ? (
        <>
          <button
            className="hover:text-brand1-600 flex flex-row items-center gap-1 py-1 pl-16"
            onClick={prevCanvasClickHandler}
          >
            <ChevronLeftIcon className="h-4 w-4 fill-neutral-500" /> Prev letter
          </button>
          <button
            className="hover:text-brand1-600 flex flex-row items-center gap-1 py-1 pr-10"
            onClick={nextCanvasClickHandler}
          >
            Next letter{" "}
            <ChevronRightIcon className="h-4 w-4 fill-neutral-500" />
          </button>
        </>
      ) : null}
    </>
  );
};
