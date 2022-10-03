import { AnnoRepoAnnotation, iiifAnn } from "../model/AnnoRepoAnnotation"
import { BroccoliText, BroccoliV2 } from "../model/Broccoli"

export interface AppState {
    setStore: any
    setMirAnn: iiifAnn
    setAnno: AnnoRepoAnnotation[]
    setText: BroccoliText
    setSelectedAnn: AnnoRepoAnnotation | undefined
    setTextToHighlight: BroccoliText
    setAnnItemOpen: boolean,
    setCurrentContext: {
        volumeId?: string,
        context?: string | number,
    }
    setBroccoli: BroccoliV2,
    setOpeningVol: {
        opening: string,
        volume: string,
    },
    setCanvas: {
        canvasIds: string[],
        currentIndex: number
    }
}

export const initialAppState: AppState = {
    setStore: null,
    setMirAnn: null,
    setAnno: null,
    setText: null,
    setSelectedAnn: undefined,
    setTextToHighlight: null,
    setAnnItemOpen: false,
    setCurrentContext: {
        volumeId: null,
        context: null,
    },
    setBroccoli: null,
    setOpeningVol: {
        opening: null,
        volume: null
    },
    setCanvas: {
        canvasIds: null,
        currentIndex: null
    }
}