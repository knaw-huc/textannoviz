import mirador from "mirador-knaw-huc-mui5";
import { Iiif } from "../../model/Broccoli";
import { ProjectConfig } from "../../model/ProjectConfig";
import { zoomCoordsMirador } from "../../utils/zoomCoordsMirador";
import { AnnoRepoAnnotation } from "../../model/AnnoRepoAnnotation.ts";

export function zoomAnnoMirador(
  bodyId: string,
  anno: AnnoRepoAnnotation[],
  iiif: Iiif,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  miradorStore: any,
  projectConfig: ProjectConfig,
) {
  const annoToZoom = anno.find((anno) => anno.body.id === bodyId);

  if (annoToZoom) {
    miradorStore.dispatch(
      mirador.actions.selectAnnotation(
        `${projectConfig.id}`,
        annoToZoom.body.id,
      ),
    );
    const zoomCoords = zoomCoordsMirador(
      annoToZoom ? annoToZoom : anno[0],
      iiif.canvasIds[0],
    );

    /* 
    It appears that "flip" and "rotation" are required. See:
    https://github.com/ProjectMirador/mirador/issues/3781,
    https://github.com/ProjectMirador/mirador/blob/master/src/components/OpenSeadragonViewer.js#L169-L182
    */
    if (zoomCoords) {
      miradorStore.dispatch(
        mirador.actions.updateViewport(`${projectConfig.id}`, {
          x: zoomCoords.zoomCenter.x,
          y: zoomCoords.zoomCenter.y,
          zoom: 0.75 / zoomCoords.miradorZoom,
          flip: false,
          rotation: 0,
        }),
      );
    }
  }
}
