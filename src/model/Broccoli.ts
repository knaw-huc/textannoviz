import { AnnoRepoAnnotation } from "./AnnoRepoAnnotation"

// export interface BroccoliV0 {
//     "type": string,
//     "request": {
//         "volume": string,
//         "opening": number
//     },
//     "iiif": {
//         "manifest": string,
//         "canvasId": string
//     },
//     "anno": ElucidateAnnotation[],
//     "text": string[]
// }

export interface BroccoliV1 {
    "type": string,
    "request": {
        "volume": string,
        "opening": number
    },
    "iiif": {
        "manifest": string,
        "canvasId": string
    },
    "anno": AnnoRepoAnnotation[],
    "text": string[]
}