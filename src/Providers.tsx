import React from "react"
import { AnnotationsContext, annotationsReducer, defaultAnnotationsContext } from "./components/Annotations/AnnotationsContext"
import { defaultMiradorContext, MiradorContext, miradorReducer } from "./components/Mirador/MiradorContext"
import { defaultTextContext, TextContext, textReducer } from "./components/Text/TextContext"

export const Providers = (props: { children: React.ReactNode }) => {
    const [miradorState, setMiradorState] = React.useReducer(
        miradorReducer,
        defaultMiradorContext.state
    )
    const [annotationsState, setAnnotationsState] = React.useReducer(
        annotationsReducer,
        defaultAnnotationsContext.state
    )
    const [textState, setTextState] = React.useReducer(
        textReducer,
        defaultTextContext.state
    )

    return (
        <MiradorContext.Provider value={{
            state: miradorState,
            setState: setMiradorState
        }}>
            <AnnotationsContext.Provider value={{
                state: annotationsState,
                setState: setAnnotationsState
            }}>
                <TextContext.Provider value={{
                    state: textState,
                    setState: setTextState
                }}>
                    {props.children}
                </TextContext.Provider>
            </AnnotationsContext.Provider>
        </MiradorContext.Provider>
    )
}