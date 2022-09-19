import { AnnoRepoAnnotation, CanvasTarget, ImageApiSelector } from "../../model/AnnoRepoAnnotation"

function getImageRegions(value: string) {
    const result = value.match(/[0-9]+.*[0-9]+.*[0-9]+.*[0-9]+/i)
    return result
}

export function findImageRegions(annotation: AnnoRepoAnnotation, canvasId: string) {
    const imageCoords = (annotation.target as CanvasTarget[])
        .filter(t => t.source.includes(canvasId))
        .flatMap(t => t.selector && t.selector.filter(t => t.type === "iiif:ImageApiSelector"))
        .filter(t => t !== undefined)
    
    console.log(imageCoords)
    
    if (imageCoords[0] as ImageApiSelector !== undefined) {
        return getImageRegions((imageCoords[0] as ImageApiSelector).region)
    } else {
        console.log(annotation.body.id + " has no image targets")
    }
}