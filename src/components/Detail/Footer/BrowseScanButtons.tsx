import mirador from "mirador-knaw-huc-mui5";
import { Button } from "react-aria-components";
import { CanvasTarget } from "../../../model/AnnoRepoAnnotation";
import { useAnnotationStore } from "../../../stores/annotation";
import { useInternalMiradorStore } from "../../../stores/internal-mirador.ts";
import { useMiradorStore } from "../../../stores/mirador.ts";
import {
  projectConfigSelector,
  translateSelector,
  useProjectStore,
} from "../../../stores/project";
import { visualizeAnnosMirador } from "../../../utils/visualizeAnnosMirador";

export function BrowseScanButtons() {
  const translate = useProjectStore(translateSelector);
  const projectConfig = useProjectStore(projectConfigSelector);
  const annotations = useAnnotationStore().annotations;
  const miradorStore = useInternalMiradorStore().miradorStore;
  const projectName = useProjectStore().projectName;
  const pageAnnoType = projectConfig.pageAnnotation;
  const { currentCanvas } = useMiradorStore();

  const pageAnnotations = annotations.filter(
    (anno) => anno.body.type === pageAnnoType,
  );

  const canvases = pageAnnotations.flatMap((pageAnno) =>
    (pageAnno.target as CanvasTarget[])
      .filter((t) => t.type === "Canvas")
      .map((t) => t.source),
  );

  const firstCanvas = canvases[0];
  const lastCanvas = canvases[canvases.length - 1];

  function prevCanvas() {
    miradorStore.dispatch(mirador.actions.setPreviousCanvas(projectName));
    if (projectConfig.visualizeAnnosMirador) {
      updateMiradorSvgs();
    }
  }

  function nextCanvas() {
    miradorStore.dispatch(mirador.actions.setNextCanvas(projectName));
    if (projectConfig.visualizeAnnosMirador) {
      updateMiradorSvgs();
    }
  }

  function updateMiradorSvgs() {
    /**
     * Mirador's internal state is used below because the new contents of the state are needed in the same render as the state is updated
     * (see {@link nextCanvas} and {@link prevCanvas} for where the state is updated)
     * Mirador's internal state is always up-to-date, whilst TAV's own Mirador store is one behind at this point due to what is written above.
     */
    const newCanvas = miradorStore?.getState().windows[projectName]
      .canvasId as string;

    visualizeAnnosMirador(annotations, miradorStore, newCanvas, projectConfig);
  }

  return (
    <>
      <Button
        isDisabled={currentCanvas === firstCanvas}
        className="hover:text-brand1-600 active:text-brand1-700 disabled:text-brand1-200 flex flex-row items-center gap-1 py-1 pl-16 outline-none"
        onPress={prevCanvas}
      >
        {translate("PREV_SCAN")}
      </Button>
      <Button
        isDisabled={currentCanvas === lastCanvas}
        className="hover:text-brand1-600 active:text-brand1-700 disabled:text-brand1-200 flex flex-row items-center gap-1 py-1 pl-16 outline-none"
        onPress={nextCanvas}
      >
        {translate("NEXT_SCAN")}
      </Button>
    </>
  );
}
