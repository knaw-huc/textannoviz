import { AnnoRepoAnnotation, AttendantBody } from "../../model/AnnoRepoAnnotation"

export default function getAttendantInfo(annotation: AnnoRepoAnnotation, info: string): string | number {
    const body = (annotation.body as AttendantBody[]).find((b: AttendantBody) => b.value[info])
    return body.value[info]
}