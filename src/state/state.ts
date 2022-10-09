import { AnnoRepoAnnotation, iiifAnn } from "../model/AnnoRepoAnnotation"
import { BroccoliText, BroccoliV2 } from "../model/Broccoli"

export interface AppState {
    mirador: {
        store: any,
        mirAnn: iiifAnn
    }
    annotations: {
        annotations: AnnoRepoAnnotation[],
        selectedAnn: AnnoRepoAnnotation | undefined,
        annItemOpen: boolean
    }
    text: {
        text: BroccoliText,
        textToHighlight: BroccoliText
    }
    broccoli: BroccoliV2
    app: {
        currentContext: {
            volumeId?: string,
            context?: string | number
        },
        openingVol: {
            opening: string,
            volume: string
        },
        canvas: {
            canvasIds: string[],
            currentIndex: number
        }
    }
}

export const initialAppState: AppState = {
    mirador: {
        store: null,
        mirAnn: null
    },
    annotations: {
        annotations: null,
        selectedAnn: undefined,
        annItemOpen: false
    },
    text: {
        text: null,
        textToHighlight: null
    },
    broccoli: null,
    app: {
        currentContext: {
            volumeId: null,
            context: null
        },
        openingVol: {
            opening: null,
            volume: null
        },
        canvas: {
            canvasIds: null,
            currentIndex: null
        }
    }
}