import { AnnoRepoAnnotation, ImageTarget } from "../../model/AnnoRepoAnnotation"

export default function findImageRegions(annotation: AnnoRepoAnnotation) {
    function getImageRegions(value: string) {
        const result = value.match(/[0-9]+.*[0-9]+.*[0-9]+.*[0-9]+/i)
        return result
    }
    
    const imageCoords = (annotation.target as ImageTarget[])[0].selector.value

    return getImageRegions(imageCoords)
}