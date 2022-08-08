import { AnnoRepoAnnotation, AttendantBody } from "../../model/AnnoRepoAnnotation"

export default function getAttendantName(annotation: AnnoRepoAnnotation): string | number {
    return (annotation.body as AttendantBody).metadata.delegateName
}