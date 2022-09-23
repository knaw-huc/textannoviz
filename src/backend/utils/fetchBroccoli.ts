import { HOSTS } from "../../Config"

export const fetchBroccoliOpening = async (volume = "1728", opening = "285") => {
    if (parseInt(opening) < 1) {
        alert("Opening number lower than 1 is not allowed!")
        return
    }

    const response = await fetch(`${HOSTS.BROCCOLI}/v2?volume=${volume}&opening=${opening}`)
    if (!response.ok) {
        const error = await response.json()
        alert(`${error.message}`)
        return
    }
    return response.json()
}

export const fetchBroccoliResolution = async (resolutionId = "urn:republic:session-1728-09-24-ordinaris-num-1-resolution-1") => {
    const response = await fetch(`${HOSTS.BROCCOLI}/v2/resolutions/${resolutionId}`)
    if (!response.ok) return null
    return response.json()
}

export const fetchBroccoliBodyId = async (volume = "1728", opening = "285", bodyId = "urn:republic:session-1728-06-19-ordinaris-num-1-para-2") => {
    const response = await fetch(`${HOSTS.BROCCOLI}/v2?volume=${volume}&opening=${opening}&bodyId=${bodyId}`)
    if (!response.ok) return null
    return response.json()
}