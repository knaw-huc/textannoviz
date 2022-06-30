import { ElucidateAnnotation, ElucidateBody } from "../../model/ElucidateAnnotation"

export default function bodyValue(annotation: ElucidateAnnotation): string {
    if (Array.isArray(annotation.body)) {
        const body = (annotation.body as ElucidateBody[]).find((b: { value: string; }) => b.value)
        if (body) {
            return body.value
        } else {
            throw new Error("No body id found in " + JSON.stringify(annotation))
        }
    } else {
        return (annotation.body as ElucidateBody).value
    }
}