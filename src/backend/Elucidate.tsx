import {ElucidateAnnotation} from "../model/ElucidateAnnotation"
import { HOSTS } from "../Config"

export default class Elucidate {
    static readonly headers = {
        "Accept": "application/ld+json; profile=\"http://www.w3.org/ns/anno.jsonld\"",
        "Content-Type": "application/ld+json; profile=\"http://www.w3.org/ns/anno.jsonld\""
    }

    public static async getByJpg(jpg: string): Promise<ElucidateAnnotation[]> {
        const result: ElucidateAnnotation[] = []
        let annotationPage
        let page = 0
        do {
            const response = await fetch(
                `${HOSTS.ELUCIDATE}/annotation/w3c/services/search/target?fields=source&value=${jpg}&page=${page}&desc=1`,
                { headers: this.headers }
            )
            annotationPage = await response.json()
            if (annotationPage.items) {
                result.push(...annotationPage.items)
            }
            page++
        } while (annotationPage.next)
        return result
    }
}