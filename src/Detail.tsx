import React from "react"
import styled from "styled-components"
import { Annotation } from "./components/Annotations/annotation"
import { Mirador } from "./components/Mirador/Mirador"
import { Text } from "./components/Text/text"
import { Providers } from "./Providers"

const AppContainer = styled.div`
    border-style: solid;
    border-color: black;
    border-width: 2px;
`

const Row = styled.div`
    display: flex;
    flex-direction: row;
`

export const Detail = () => {
    return (
        <Providers>
            <AppContainer id="appcontainer">
                <Row id="row">
                    <Mirador />
                    <Text />
                    <Annotation />
                </Row>
            </AppContainer>
        </Providers>
    )
}