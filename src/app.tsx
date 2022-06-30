import React from "react"
import { Annotation } from "./components/Annotation"
import { Text } from "./components/Text"
import { Mirador } from "./components/Mirador"
import { useAppState } from "./state/reducer"
import { appContext } from "./state/context"
import styled from "styled-components"

const AppContainer = styled.div`
    border-style: solid;
    border-color: black;
    border-width: 2px;
`

const Row = styled.div`
    display: flex;
    flex-direction: row;
`

export function App() {
    const [state, dispatch] = useAppState()

    return (
        <appContext.Provider value={{ state, dispatch }}>
            <AppContainer id="appcontainer">
                <Row id="row">
                    <Mirador />
                    <Text />
                    <Annotation />
                </Row>
            </AppContainer>
        </appContext.Provider>
    )
}