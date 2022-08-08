export async function fetchJson(url: string) {
    const response = await fetch(url)
    if (!response.ok) return null
    return await response.json()
}