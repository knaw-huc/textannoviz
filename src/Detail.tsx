import mirador from "mirador"
import React from "react"
import styled from "styled-components"
import { Annotation } from "./components/Annotations/annotation"
import { Mirador } from "./components/Mirador/Mirador"
import { Text } from "./components/Text/text"
import { Providers } from "./Providers"
import { useAnnotationsContext } from "./components/Annotations/AnnotationsContext"
import { useMiradorContext } from "./components/Mirador/MiradorContext"
import { useTextContext } from "./components/Text/TextContext"
import { fetchBroccoliOpening, fetchBroccoliResolution } from "./backend/utils/fetchBroccoli"
import { useParams } from "react-router-dom"
import { BroccoliV2 } from "./model/Broccoli"
import { miradorConfig } from "./components/Mirador/MiradorConfig"
import { visualizeAnnosMirador } from "./backend/utils/visualizeAnnosMirador"

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