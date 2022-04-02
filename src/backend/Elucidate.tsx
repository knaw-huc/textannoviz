export default class Elucidate {
    static readonly host = 'http://localhost:8000/elucidate'

    static readonly headers = {
        'Accept': 'application/ld+json; profile="http://www.w3.org/ns/anno.jsonld"',
        'Content-Type': 'application/ld+json; profile="http://www.w3.org/ns/anno.jsonld"'
    };

    public static async getByJpg(jpg: string) {
        const result = []
        let annotationPage
        let page = 0
        do {
            const response = await fetch(
                `${this.host}/annotation/w3c/services/search/target?fields=source&value=${jpg}&page=${page}&desc=1`,
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

/**
 * TODO:
 * Do not get annotations with items.body.value === 'textregion'
 * Can this be done with Elucidate or should I filter myself?
 */