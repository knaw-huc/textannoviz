import { ElucidateAnnotation, AttendantBody } from "../../model/ElucidateAnnotation"

export default function getAttendantInfo(annotation: ElucidateAnnotation, info: string): string | number {
    const body = (annotation.body as AttendantBody[]).find((b: AttendantBody) => b.value[info])
    return body.value[info]
}