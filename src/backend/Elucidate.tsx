export default class Elucidate {
    static readonly headers = {
        'Accept': 'application/ld+json; profile="http://www.w3.org/ns/anno.jsonld"',
        'Content-Type': 'application/ld+json; profile="http://www.w3.org/ns/anno.jsonld"'
      };

    public static async getByJpg(jpg: any) {
        const result = []
        let annotationPage
        const response = await fetch(
            `http://localhost:8000/elucidate/annotation/w3c/services/search/target?fields=source&value=${jpg}&page=0&desc=1`,
            {headers: this.headers}
        );
        annotationPage = await response.json();
        if (annotationPage.items) {
            result.push(...annotationPage.items)
        }
        return result
    }
}