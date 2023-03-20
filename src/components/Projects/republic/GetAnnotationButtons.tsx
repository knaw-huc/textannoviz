import mirador from "mirador";
import { useNavigate, useParams } from "react-router-dom";
import { useAnnotationStore } from "../../../stores/annotation";
import { useMiradorStore } from "../../../stores/mirador";
import { Button } from "../../Button";

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
        <div>
          <Button onClick={previousCanvasClickHandler}>Previous canvas</Button>
          <Button onClick={nextCanvasClickHandler}>Next canvas</Button>
        </div>
      ) : null}
    </>
  );
};
