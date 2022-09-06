import { AnnoRepoAnnotation, ImageTarget } from "../../model/AnnoRepoAnnotation"

function getImageRegions(value: string) {
    const result = value.match(/[0-9]+.*[0-9]+.*[0-9]+.*[0-9]+/i)
    return result
}

export function findImageRegions(annotation: AnnoRepoAnnotation, context: string) {
    const imageCoords = (annotation.target as ImageTarget[])
        .filter(t => t.source.includes(context))
        .flatMap(t => t.selector && t.selector.filter(t => t.type === "FragmentSelector"))
        .filter(t => t !== undefined)

    return getImageRegions(imageCoords[0].value)
}