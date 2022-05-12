// import { ElucidateTarget } from "../../model/ElucidateAnnotation"

export default function findImageRegions(target: any[]) {
    const filtered = target.filter(t => t.type === "Image")
    const value = filtered[0].selector.value
    const result = value.match(/[0-9]+.*[0-9]+.*[0-9]+.*[0-9]+/i)
    const string = result.toString()
    const split = string.split(",")

    const [x, y, w, h] = split.map((i: string) => {
        return parseInt(i)
    })

    return [x, y, w, h]
}