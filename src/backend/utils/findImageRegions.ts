// import { ElucidateTarget } from "../../model/ElucidateAnnotation"
import getBodyValue from "../utils/getBodyValue"

export default function findImageRegions(annotation: any) {
    const filtered = annotation.target.filter((t: { type: string }) => t.type === "Image")

    if (getBodyValue(annotation) === "scanpage" || getBodyValue(annotation) === "session") {
        const value = filtered[1].selector.value
        return getImageRegions(value)
    } else {
        const value = filtered[0].selector.value
        return getImageRegions(value)
    }

    function getImageRegions(value: string) {
        const result = value.match(/[0-9]+.*[0-9]+.*[0-9]+.*[0-9]+/i)
        return result
        // const string = result.toString()
        // const split = string.split(",")
        // const [x, y, w, h] = split.map((i: string) => {
        //     return parseInt(i)
        // })
        // return [x, y, w, h]
    }
}