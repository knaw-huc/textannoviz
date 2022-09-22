export async function fetchJson(url: string) {
    const response = await fetch(url)
    if (!response.ok) return response.status
    return await response.json()
}