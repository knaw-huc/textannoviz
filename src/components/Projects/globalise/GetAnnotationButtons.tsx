import mirador from "mirador";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import { useMiradorStore } from "../../../stores/mirador";
import { globaliseConfig } from "./config";

const Button = styled.button`
  background: #0d6efd;
  border-radius: 3px;
  border: none;
  color: white;
  padding: 5px;
  margin-right: 0.5em;
`;

export const GetAnnotationButtons = () => {
  const miradorStore = useMiradorStore((state) => state.miradorStore);
  const currentContext = useMiradorStore((state) => state.currentContext);
  const params = useParams();
  const navigate = useNavigate();

  const documentIndices = globaliseConfig.documents?.find(
    (document) => currentContext.tier0 === document.docNr
  );

  if (!documentIndices) return null;

  const indices = documentIndices.index;

  const nextCanvasClickHandler = () => {
    const currentIndex = indices.indexOf(currentContext.tier1);
    const nextCanvas = indices[currentIndex + 1];
    if (!indices.includes(nextCanvas)) {
      toast(
        `Opening ${indices[currentIndex] + 1} does not exist in document ${
          currentContext.tier0
        }!`,
        { type: "error" }
      );
      return;
    }
    const document = currentContext.tier0;

    navigate(`/detail/${document}/${nextCanvas.toString()}`);
    miradorStore.dispatch(mirador.actions.setNextCanvas("globalise"));

    console.log(miradorStore.getState());
  };

  const previousCanvasClickHandler = () => {
    const currentIndex = indices.indexOf(currentContext.tier1);
    const prevCanvas = indices[currentIndex - 1];
    if (!indices.includes(prevCanvas)) {
      toast(
        `Opening ${indices[currentIndex] - 1} does not exist in document ${
          currentContext.tier0
        }!`,
        { type: "error" }
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
        <div>
          <Button onClick={previousCanvasClickHandler}>Previous canvas</Button>
          <Button onClick={nextCanvasClickHandler}>Next canvas</Button>
        </div>
      ) : null}
    </>
  );
};
