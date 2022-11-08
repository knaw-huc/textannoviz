import { AnnoRepoAnnotation } from "./AnnoRepoAnnotation"

// export interface BroccoliV0 {
//     type: string,
//     request: {
//         volume: string,
//         opening: number
//     },
//     iiif: {
//         manifest: string,
//         canvasId: string
//     },
//     anno: ElucidateAnnotation[],
//     text: string[]
// }

// export interface BroccoliV1 {
//     type: string,
//     request: OpeningRequest | ResolutionRequest,
//     iiif: {
//         manifest: string,
//         canvasId: string
//     },
//     anno: AnnoRepoAnnotation[],
//     text: string[]
// }

export interface BroccoliV2 {
    type: string,
    request: OpeningRequest | ResolutionRequest,
    iiif: {
        manifest: string,
        canvasIds: string[]
    },
    anno: AnnoRepoAnnotation[],
    text: BroccoliText
}

export interface OpeningRequest {
    volumeId: string,
    openingNr: number
}

export interface ResolutionRequest {
    resolutionId: string
}

export interface BroccoliText {
    location: {
        relativeTo: string,
        start: {
            line: number,
            offset: number,
            len: number
        },
        end: {
            line: number,
            offset: number,
            len: number
        },
    }
    lines: string[]
}