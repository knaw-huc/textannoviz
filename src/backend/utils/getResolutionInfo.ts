import { AnnoRepoAnnotation, ResolutionBody } from "../../model/AnnoRepoAnnotation"

export default function getResolutionInfo(annotation: AnnoRepoAnnotation, info: string): string | number {
    if (Array.isArray(annotation.body)) {
        const body = (annotation.body as ResolutionBody[]).find((b: ResolutionBody) => b[info])
        return body[info]
    } else {
        return
    }
}