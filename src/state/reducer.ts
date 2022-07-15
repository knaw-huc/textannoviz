import React, { useReducer } from "react"
import { ACTIONS } from "./actions"
import { ElucidateAnnotation } from "../model/ElucidateAnnotation"
import mirador from "mirador"
import annotationPlugins from "mirador-annotations/es"
import findImageRegions from "../backend/utils/findImageRegions"
import getBodyValue from "../backend/utils/getBodyValue"
import annotation from "../data/annotation.json"
import { miradorConfig } from "../components/MiradorConfig"

export interface AppState {
    store: any
    MirAnn: any
    anno: ElucidateAnnotation[]
    text: any
    selectedAnn: any
}

interface SetStore {
    type: ACTIONS.SET_STORE,
    store: any
}

interface SetMirAnn {
    type: ACTIONS.SET_MIRANN,
    MirAnn: any
}

interface SetAnno {
    type: ACTIONS.SET_ANNO,
    anno: ElucidateAnnotation[]
}

interface SetText {
    type: ACTIONS.SET_TEXT,
    text: any
}

interface SetSelectedAnn {
    type: ACTIONS.SET_SELECTEDANN,
    selectedAnn: any
}

export type AppAction = SetStore | SetMirAnn | SetAnno | SetText | SetSelectedAnn

export const initAppState: AppState = {
    store: null,
    MirAnn: null,
    anno: null,
    text: null,
    selectedAnn: null,
}

async function fetchJson(url: string) {
    const response = await fetch(url)
    if (!response.ok) return null
    return await response.json()
}

export function useAppState(): [AppState, React.Dispatch<AppAction>] {
    const [state, dispatch] = useReducer(reducer, initAppState)

    React.useEffect(() => {
        fetchJson("https://broccoli.tt.di.huc.knaw.nl/republic/v0?opening=285&volume=1728")
            .then(function(broccoli) {
                console.log(broccoli)
                miradorConfig.windows[0].loadedManifest = broccoli.iiif.manifest
                miradorConfig.windows[0].canvasId = broccoli.iiif.canvasId
                const viewer = mirador.viewer(miradorConfig, [...annotationPlugins])
                dispatch({
                    type: ACTIONS.SET_STORE,
                    store: viewer.store
                })

                dispatch({
                    type: ACTIONS.SET_ANNO,
                    anno: broccoli.anno
                })

                dispatch({
                    type: ACTIONS.SET_TEXT,
                    text: broccoli.text
                })

                const currentState = viewer.store.getState()

                const regions = broccoli.anno.flatMap((item: ElucidateAnnotation) => {
                    const region = findImageRegions(item)
                    return region
                })

                const resources = regions.flatMap((region: string, i: number) => {
                    const [x, y, w, h] = region.split(",")
                    // console.log(split)
                    let colour = ""

                    switch (getBodyValue(broccoli.anno[i])) {
                    case "resolution":
                        colour = "green"
                        break
                    case "attendant":
                        colour = "#DB4437"
                        break
                    default:
                        colour = "white"
                    }

                    const resources = [{
                        "@id": `${broccoli.anno[i].id}`,
                        "@type": "oa:Annotation",
                        "motivation": [
                            "oa:commenting", "oa:Tagging"
                        ],
                        "on": [{
                            "@type": "oa:SpecificResource",
                            "full": `${currentState.windows.republic.canvasId}`,
                            "selector": {
                                "@type": "oa:Choice",
                                "default": {
                                    "@type": "oa:FragmentSelector",
                                    "value": `xywh=${x},${y},${w},${h}`
                                },
                                "item": {
                                    "@type": "oa:SvgSelector",
                                    "value": `<svg xmlns='http://www.w3.org/2000/svg'><path xmlns="http://www.w3.org/2000/svg" id="testing" d="M${x},${parseInt(y) + parseInt(h)}v-${h}h${w}v${h}z" stroke="${colour}" fill="${colour}" fill-opacity="0.5" stroke-width="1"/></svg>`
                                }
                            },
                            "within": {
                                "@id": "https://images.diginfra.net/api/pim/imageset/67533019-4ca0-4b08-b87e-fd5590e7a077/manifest",
                                "@type": "sc:Manifest"
                            }
                        }],
                        "resource": [{
                            "@type": "dctypes:Text",
                            "format": "text/html",
                            "chars": `${getBodyValue(broccoli.anno[i])}`
                        }, {
                            "@type": "oa:Tag",
                            "format": "text/html",
                            "chars": `${getBodyValue(broccoli.anno[i])}`
                        }]
                    }]

                    return resources
                })

                annotation.resources.push(...resources)

                console.log(viewer.store.dispatch(mirador.actions.receiveAnnotation(`${currentState.windows.republic.canvasId}`, "annotation", annotation)))

                dispatch({
                    type: ACTIONS.SET_MIRANN,
                    MirAnn: annotation
                })
            })
            .catch(console.error)
    }, [])
    return [state, dispatch]
}

function reducer(state: AppState, action: AppAction): AppState {
    console.log(action, state)
    switch (action.type) {
    case ACTIONS.SET_STORE:
        return setStore(state, action)
    case ACTIONS.SET_MIRANN:
        return setMirAnn(state, action)
    case ACTIONS.SET_ANNO:
        return setAnno(state, action)
    case ACTIONS.SET_TEXT:
        return setText(state, action)
    case ACTIONS.SET_SELECTEDANN:
        return setSelectedAnn(state, action)
    default:
        return state
    }
}

function setStore(state: AppState, action: SetStore) {
    return {
        ...state,
        store: action.store
    }
}

function setMirAnn(state: AppState, action: SetMirAnn) {
    return {
        ...state,
        MirAnn: action.MirAnn
    }
}

function setAnno(state: AppState, action: SetAnno) {
    return {
        ...state,
        anno: action.anno
    }
}

function setText(state: AppState, action: SetText) {
    return {
        ...state,
        text: action.text
    }
}

function setSelectedAnn(state: AppState, action: SetSelectedAnn) {
    return {
        ...state,
        selectedAnn: action.selectedAnn
    }
}