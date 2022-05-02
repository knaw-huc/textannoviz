export default function bodyValue(annotation: any): any {
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
        const body = annotation.body.find((b: { value: string; }) => b.value);
        if (body) {
            return body.value;
        } else {
            throw new Error('No body id found in ' + JSON.stringify(annotation));
        }
    } else {
        return annotation.body.value;
    }
}