import React from "react"
import styled from "styled-components"

const MiradorStyled = styled.div`
    position: relative;
    min-width: 600px;
    height: 800px;
`
export function Mirador() {
    return (
        <MiradorStyled id="mirador" />
    )
}