import { fetchJson } from "./fetchJson"
import { HOSTS } from "../../Config"

export const fetchBroccoliOpening = (volume = "1728", opening = "285") => {
    const response = fetchJson(`${HOSTS.BROCCOLI}/v1?volume=${volume}&opening=${opening}`)
    return response
}

export const fetchBroccoliResolution = (volume = "1728", resolution = "urn:republic:session-1728-09-24-ordinaris-num-1-resolution-1") => {
    const response = fetchJson(`${HOSTS.BROCCOLI}/v2/${volume}/resolution/${resolution}`)
    return response
}