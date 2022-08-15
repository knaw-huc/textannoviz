import { fetchJson } from "./fetchJson"

export const fetchBroccoli = (opening = 285, volume = 1728) => {
    const response = fetchJson(`https://broccoli.tt.di.huc.knaw.nl/republic/v1?opening=${opening}&volume=${volume}`)
    return response
}