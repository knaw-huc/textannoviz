import React from "react"
import { Annotation } from "./components/Annotation"
import { Text } from "./components/Text"
import { Mirador } from "./components/Mirador"
import { useAppState } from "./state/reducer"
import { appContext } from "./state/context"

export function App() {
    const [state, dispatch] = useAppState()

    return (
        <appContext.Provider value={{ state, dispatch }}>
            <div id="appcontainer">
                <div id='row'>
                    <div id='mirador'>
                        <Mirador />
                    </div>
                    <div id='text'>
                        <Text />
                    </div>
                    <div id='annotation'>
                        <Annotation />
                    </div>
                </div>
            </div>
        </appContext.Provider>
    )
}