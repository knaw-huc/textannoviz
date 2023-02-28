import mirador from "mirador";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { useMiradorStore } from "../../../stores/mirador";

const Button = styled.button`
  background: #0d6efd;
  border-radius: 3px;
  border: none;
  color: white;
  padding: 5px;
  margin-right: 0.5em;
`;

export const GetAnnotationButtons = () => {
  const currentContext = useMiradorStore((state) => state.currentContext);
  const miradorStore = useMiradorStore((state) => state.miradorStore);
  const params = useParams();
  const navigate = useNavigate();

  const nextCanvasClickHandler = () => {
    const nextCanvas = (currentContext.tier1 as number) + 1;
    const volume = currentContext.tier0;

    navigate(`/detail/${volume}/${nextCanvas.toString()}`);
    miradorStore.dispatch(mirador.actions.setNextCanvas("republic"));
  };

  const previousCanvasClickHandler = () => {
    const prevCanvas = (currentContext.tier1 as number) - 1;
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
