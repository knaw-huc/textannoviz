import { HOSTS } from "../Config"

export default class TextRepo {
    public static async getByVersionIdAndRange(id: string, start: number, end: number): Promise<string[]> {
        const res = await fetch(`${HOSTS.TEXTREPO}/view/versions/${id}/segments/index/${start}/${end}`,)
        
        return await res.json()
    }
}