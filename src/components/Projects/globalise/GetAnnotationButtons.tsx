import mirador from "mirador";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import { miradorContext } from "../../../state/mirador/MiradorContext";
import { globaliseConfig } from "./config";

const Button = styled.button`
  background: #0d6efd;
  border-radius: 3px;
  border: none;
  color: white;
  padding: 5px;
  margin-right: 0.5em;
`;

export const AnnotationButtons = () => {
  const { miradorState } = React.useContext(miradorContext);
  const params = useParams();
  const navigate = useNavigate();

  const documentIndices = globaliseConfig.documents?.find(
    (document) => miradorState.currentContext.tier0 === document.docNr
  );

  if (!documentIndices) return null;

  const indices = documentIndices.index;

  const nextCanvasClickHandler = () => {
    const currentIndex = indices.indexOf(miradorState.currentContext.tier1);
    const nextCanvas = indices[currentIndex + 1];
    if (!indices.includes(nextCanvas)) {
      toast(
        `Opening ${indices[currentIndex] + 1} does not exist in document ${
          miradorState.currentContext.tier0
        }!`,
        { type: "error" }
      );
      return;
    }
    const document = miradorState.currentContext.tier0;

    navigate(`/detail/documents/${document}/openings/${nextCanvas.toString()}`);
    miradorState.store.dispatch(mirador.actions.setNextCanvas("globalise"));

    console.log(miradorState.store.getState());
  };

  const previousCanvasClickHandler = () => {
    const currentIndex = indices.indexOf(miradorState.currentContext.tier1);
    const prevCanvas = indices[currentIndex - 1];
    if (!indices.includes(prevCanvas)) {
      toast(
        `Opening ${indices[currentIndex] - 1} does not exist in document ${
          miradorState.currentContext.tier0
        }!`,
        { type: "error" }
      );
      return;
    }

    const document = miradorState.currentContext.tier0;

    navigate(`/detail/documents/${document}/openings/${prevCanvas.toString()}`);
    miradorState.store.dispatch(mirador.actions.setPreviousCanvas("globalise"));
  };

  return (
    <>
      {params.documentId && params.openingNum ? (
        <div>
          <Button onClick={previousCanvasClickHandler}>Previous canvas</Button>
          <Button onClick={nextCanvasClickHandler}>Next canvas</Button>
        </div>
      ) : null}
    </>
  );
};
