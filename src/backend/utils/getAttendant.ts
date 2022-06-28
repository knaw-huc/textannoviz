import { ElucidateAnnotation, ElucidateBody } from "../../model/ElucidateAnnotation"

export default function attendantValue(annotation: ElucidateAnnotation): string {
    // console.log(annotation)
    // return annotation.map((item: { body: any; }) => {
    //     if (Array.isArray(item.body)) {
    //         const body = item.body.find((b: { value: string; }) => b.value);
    //         if (body) {
    //             return body.value;
    //         } else {
    //             throw new Error('Bla');
    //         }
    //     } else {
    //         return item.body.value;
    //     }
    // });
    if (Array.isArray(annotation.body)) {
        console.log(annotation.body[1])
        const body = (annotation.body as ElucidateBody[]).find(b => b.value)
        if (body) {
            return body.value
        } else {
            throw new Error("No body id found in " + JSON.stringify(annotation))
        }
    } else {
        return (annotation.body as ElucidateBody).value
    }
}