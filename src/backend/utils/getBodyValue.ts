import { AnnoRepoAnnotation, AnnoRepoBody } from "../../model/AnnoRepoAnnotation"

export default function bodyValue(annotation: AnnoRepoAnnotation): string {
    if (Array.isArray(annotation.body)) {
        const body = (annotation.body as AnnoRepoBody[]).find((b: { value: string; }) => b.value)
        if (body) {
            return body.value
        } else {
            throw new Error("No body id found in " + JSON.stringify(annotation))
        }
    } else {
        return (annotation.body as AnnoRepoBody).value
    }
}