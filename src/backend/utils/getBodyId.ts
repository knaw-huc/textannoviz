import { ElucidateAnnotation, ElucidateBody } from "../../model/ElucidateAnnotation"

export default function findBodyId(annotation: ElucidateAnnotation): string {
    if (Array.isArray(annotation.body)) {
        const body = (annotation.body as ElucidateBody[]).find((b: { id: string; }) => b.id)
        if (body) {
            return body.id
        } else {
            throw new Error("No body id found in " + JSON.stringify(annotation))
        }
    } else {
        return (annotation.body as ElucidateBody).id
    }
}