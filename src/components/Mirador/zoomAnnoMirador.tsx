import mirador from "mirador";
import { Broccoli } from "../../model/Broccoli";
import { ProjectConfig } from "../../model/ProjectConfig";
import { zoomCoordsMirador } from "../../utils/zoomCoordsMirador";

export function zoomAnnoMirador(
  broccoli: Broccoli,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  miradorStore: any,
  projectConfig: ProjectConfig,
) {
  const annoToZoom = broccoli.anno.find(
    (anno) => anno.body.id === broccoli.request.bodyId,
  );

  if (annoToZoom) {
    miradorStore.dispatch(
      mirador.actions.selectAnnotation(
        `${projectConfig.id}`,
        annoToZoom.body.id,
      ),
    );
    const zoomCoords = zoomCoordsMirador(
      annoToZoom ? annoToZoom : broccoli.anno[0],
      broccoli.iiif.canvasIds[0],
    );

    if (zoomCoords) {
      miradorStore.dispatch(
        mirador.actions.updateViewport(`${projectConfig.id}`, {
          x: zoomCoords.zoomCenter.x,
          y: zoomCoords.zoomCenter.y,
          zoom: 0.75 / zoomCoords.miradorZoom,
        }),
      );
    }
  }
}
