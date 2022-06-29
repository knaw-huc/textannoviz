import { ElucidateAnnotation, ResolutionBody } from "../../model/ElucidateAnnotation"

export default function getResolutionInfo(annotation: ElucidateAnnotation, info: string): string | number {
    const body = (annotation.body as ResolutionBody[]).find((b: ResolutionBody) => b[info])
    return body[info]
}