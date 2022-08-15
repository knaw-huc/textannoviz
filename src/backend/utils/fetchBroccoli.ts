import { fetchJson } from "./fetchJson"
import { HOSTS } from "../../Config"

export const fetchBroccoli = (opening = 285, volume = 1728) => {
    const response = fetchJson(`${HOSTS.BROCCOLI}/v1?opening=${opening}&volume=${volume}`)
    return response
}