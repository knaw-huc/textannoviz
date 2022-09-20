import { AnnoRepoAnnotation } from "../../model/AnnoRepoAnnotation"
import { findImageRegions } from "./findImageRegions"

export const zoomAnnMirador = (annotation: AnnoRepoAnnotation, canvasId: string) => {
    const region = findImageRegions(annotation, canvasId)
    const [x, y, w, h] = region[0].split(",")
    const boxToZoom = {
        x: parseInt(x),
        y: parseInt(y),
        width: parseInt(w),
        height: parseInt(h)
    }
    console.log(boxToZoom)
    const zoomCenter = {
        x: boxToZoom.x + (boxToZoom.width / 2),
        y: boxToZoom.y + (boxToZoom.height / 2)
    }

    const miradorZoom = boxToZoom.width + boxToZoom.height / 2

    console.log(zoomCenter)

    return {zoomCenter, miradorZoom}
}