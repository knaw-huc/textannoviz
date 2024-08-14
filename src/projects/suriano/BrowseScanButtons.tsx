import mirador from "mirador-knaw-huc-mui5";
import React from "react";
import { Button } from "react-aria-components";
import { CanvasTarget } from "../../model/AnnoRepoAnnotation";
import { useAnnotationStore } from "../../stores/annotation";
import { useMiradorStore } from "../../stores/mirador";
import { useProjectStore } from "../../stores/project";

export function BrowseScanButtons() {
  const annotations = useAnnotationStore().annotations;
  const miradorStore = useMiradorStore().miradorStore;
  const projectName = useProjectStore().projectName;
  const [currentCanvas, setCurrentCanvas] = React.useState("");

  const pageAnnotations = annotations.filter(
    (anno) => anno.body.type === "tf:Page",
  );

  const canvases = pageAnnotations.flatMap((pageAnno) =>
    (pageAnno.target as CanvasTarget[])
      .filter((t) => t.type === "Canvas")
      .map((t) => t.source),
  );

  const firstCanvas = canvases[0];
  const lastCanvas = canvases[canvases.length - 1];
  const miradorCanvas = miradorStore?.getState().windows[projectName]
    .canvasId as string;

  React.useEffect(() => {
    setCurrentCanvas(miradorCanvas);
  }, [miradorCanvas]);

  function prevCanvas() {
    miradorStore.dispatch(mirador.actions.setPreviousCanvas(projectName));
    setCurrentCanvas(
      miradorStore?.getState().windows[projectName].canvasId as string,
    );
  }

  function nextCanvas() {
    miradorStore.dispatch(mirador.actions.setNextCanvas(projectName));
    setCurrentCanvas(
      miradorStore?.getState().windows[projectName].canvasId as string,
    );
  }

  return (
    <>
      <Button
        isDisabled={currentCanvas === firstCanvas}
        className="hover:text-brand1-600 active:text-brand1-700 disabled:text-brand1-200 flex flex-row items-center gap-1 py-1 pl-16 outline-none"
        onPress={prevCanvas}
      >
        Prev scan
      </Button>
      <Button
        isDisabled={currentCanvas === lastCanvas}
        className="hover:text-brand1-600 active:text-brand1-700 disabled:text-brand1-200 flex flex-row items-center gap-1 py-1 pl-16 outline-none"
        onPress={nextCanvas}
      >
        Next scan
      </Button>
    </>
  );
}