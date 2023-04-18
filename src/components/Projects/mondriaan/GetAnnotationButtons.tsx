import mirador from "mirador";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "reactions";
import { useMiradorStore } from "../../../stores/mirador";
import { mondriaanConfig } from "./config";

export const GetAnnotationButtons = () => {
  const miradorStore = useMiradorStore((state) => state.miradorStore);
  const currentContext = useMiradorStore((state) => state.currentContext);
  const params = useParams();
  const navigate = useNavigate();

  const letters = mondriaanConfig.letters!;

  const nextCanvasClickHandler = () => {
    const currentIndex = letters.indexOf(currentContext.tier1);
    const nextCanvas = letters[currentIndex + 1];
    // if (!letters[nextCanvas]) {
    //   toast(
    //     `Letter ${letters[currentIndex] + 1} does not exist in folder ${
    //       currentContext.tier0
    //     }!`,
    //     { type: "error" }
    //   );
    //   return;
    // }

    const folder = currentContext?.tier0;

    navigate(`/detail/${folder}/${nextCanvas}`);
    miradorStore.dispatch(mirador.actions.setNextCanvas("mondriaan"));
  };

  const prevCanvasClickHandler = () => {
    const currentIndex = letters.indexOf(currentContext.tier1);
    const prevCanvas = letters[currentIndex - 1];
    // if (!letters[prevCanvas]) {
    //   toast(
    //     `Letter ${letters[currentIndex] - 1} does not exist in folder ${
    //       currentContext.tier0
    //     }!`,
    //     { type: "error" }
    //   );
    //   return;
    // }

    const folder = currentContext?.tier0;

    navigate(`/detail/${folder}/${prevCanvas}`);
    miradorStore.dispatch(mirador.actions.setNextCanvas("mondriaan"));
  };

  return (
    <>
      {params.tier0 && params.tier1 ? (
        <div>
          <Button onClick={prevCanvasClickHandler}>Prev letter</Button>
          <Button onClick={nextCanvasClickHandler}>Next letter</Button>
        </div>
      ) : null}
    </>
  );
};
