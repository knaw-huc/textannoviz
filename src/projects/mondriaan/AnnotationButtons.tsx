import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import mirador from "mirador";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAnnotationStore } from "../../stores/annotation";
import { useMiradorStore } from "../../stores/mirador";

const PROEFTUIN_LETTERS = [
  "19090216y_IONG_1303",
  "19090407y_IONG_1739",
  "19090421y_IONG_1304",
  "19090426y_IONG_1738",
  "19090513y_IONG_1293",
  "19090624_IONG_1294",
  "19090807y_IONG_1296",
  "19090824y_KNAP_1747",
  "19090905y_IONG_1295",
  "190909XX_QUER_1654",
  "19091024_SPOO_0016",
  "19091024y_IONG_1297",
  "19091025y_IONG_1298",
  "19100131_SAAL_ARNO_0018",
];

export const AnnotationButtons = () => {
  const miradorStore = useMiradorStore((state) => state.miradorStore);
  const currentContext = useMiradorStore((state) => state.currentContext);
  const resetOpenAnn = useAnnotationStore((state) => state.resetOpenAnn);
  const setCurrentSelectedAnn = useAnnotationStore(
    (state) => state.setCurrentSelectedAnn,
  );
  const params = useParams();
  const navigate = useNavigate();

  const letters = PROEFTUIN_LETTERS;

  const nextCanvasClickHandler = () => {
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
            className="hover:text-brand1-600 active:text-brand1-700 flex flex-row items-center gap-1 py-1 pl-16"
            onClick={prevCanvasClickHandler}
          >
            <ChevronLeftIcon className="h-4 w-4 fill-neutral-500" /> Prev letter
          </button>
          <button
            className="hover:text-brand1-600 active:text-brand1-700 flex flex-row items-center gap-1 py-1 pr-10"
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
