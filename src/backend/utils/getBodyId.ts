import { AnnoRepoAnnotation, AnnoRepoBody } from "../../model/AnnoRepoAnnotation"

export default function findBodyId(annotation: AnnoRepoAnnotation): string {
    if (Array.isArray(annotation.body)) {
        const body = (annotation.body as AnnoRepoBody[]).find((b: { id: string; }) => b.id)
        if (body) {
            return body.id
        } else {
            throw new Error("No body id found in " + JSON.stringify(annotation))
        }
    } else {
        return (annotation.body as AnnoRepoBody).id
    }
}