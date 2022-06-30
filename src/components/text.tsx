import React from "react"
import { useContext } from "react"
import { appContext } from "../state/context"
import styled from "styled-components"
import { Loading } from "../backend/utils/Loader"

const TextStyled = styled.div`
    min-width: 300px;
    height: 800px;
    padding: 0.7em;
    overflow: auto;
    white-space: pre-wrap;
    border-left: 1px solid black;
    border-right: 1px solid black;
`

export function Text() {
    const { state } = useContext(appContext)

    return (
        <TextStyled id="text">
            {state.text ? state.text.join("\n") : <Loading/>}
        </TextStyled>
    )
}