import { fetchJson } from "./fetchJson"
import { HOSTS } from "../../Config"

export const fetchBroccoliOpening = (volume = "1728", opening = "285") => {
    const response = fetchJson(`${HOSTS.BROCCOLI}/v1?volume=${volume}&opening=${opening}`)
    return response
}