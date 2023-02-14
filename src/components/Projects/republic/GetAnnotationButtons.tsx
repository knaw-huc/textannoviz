import mirador from "mirador";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { miradorContext } from "../../../state/mirador/MiradorContext";

const Button = styled.button`
  background: #0d6efd;
  border-radius: 3px;
  border: none;
  color: white;
  padding: 5px;
  margin-right: 0.5em;
`;

export const GetAnnotationButtons = () => {
  const { miradorState } = React.useContext(miradorContext);
  const params = useParams();
  const navigate = useNavigate();

  const nextCanvasClickHandler = () => {
    const nextCanvas = (miradorState.currentContext.tier1 as number) + 1;
    const volume = miradorState.currentContext.tier0;

    navigate(`/detail/volumes/${volume}/openings/${nextCanvas.toString()}`);
    miradorState.store.dispatch(mirador.actions.setNextCanvas("republic"));

    console.log(miradorState.store.getState());
  };

  const previousCanvasClickHandler = () => {
    const prevCanvas = (miradorState.currentContext.tier1 as number) - 1;
    const volume = miradorState.currentContext.tier0;

    navigate(`/detail/volumes/${volume}/openings/${prevCanvas.toString()}`);
    miradorState.store.dispatch(mirador.actions.setPreviousCanvas("republic"));
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
