import React from "react"
// import { useContext } from "react"
// import { appContext } from "../state/context"
import styled from "styled-components"
//import { Loading } from "../backend/utils/Loader"
import { TextComponent } from "./TextComponent"
//import { TextHighlighting } from "./TextHighlighting"
// import { fetchJson } from "../backend/utils/fetchJson"
// import { ACTIONS } from "../state/actions"

const TextStyled = styled.div`
    min-width: 300px;
    height: 800px;
    padding: 0.7em;
    overflow: auto;
    white-space: pre-wrap;
    border-left: 1px solid black;
    border-right: 1px solid black;
    font-size: 1rem;
    line-height: 2.25rem;
    mark {
        background-color: #ffc04b;
    }
`

// function FetchTextToHighlight() {
//     const { dispatch } = useContext(appContext)

//     /**
//      * veckhoven = attendant over 1 line
//      * coulman = only "Coulman" highlighted, so with offsets
//      * schwartzenberth = entire line highlighted
//      * res3 = entire resolution highlighted
//      */

//     const urls = {
//         veckhoven: "https://broccoli.tt.di.huc.knaw.nl/republic/v0?opening=285&volume=1728&bodyId=urn:example:republic:meeting-1728-06-19-session-1-attendant-2",
//         coulman: "https://broccoli.tt.di.huc.knaw.nl/republic/v0?opening=285&volume=1728&bodyId=urn:example:republic:meeting-1728-06-19-session-1-attendant-6",
//         schwartzenberth: "https://broccoli.tt.di.huc.knaw.nl/republic/v0?opening=285&volume=1728&bodyId=urn:example:republic:meeting-1728-06-19-session-1-attendant-11",
//         res3: "https://broccoli.tt.di.huc.knaw.nl/republic/v0?opening=285&volume=1728&bodyId=urn:example:republic:meeting-1728-06-19-session-1-resolution-3"
//     }

//     React.useEffect(() => {
//         fetchJson(urls.schwartzenberth)
//             .then(function(broccoli) {
//                 console.log(broccoli)
//                 dispatch({
//                     type: ACTIONS.SET_TEXTTOHIGHLIGHT,
//                     textToHighlight: broccoli
//                 })
//             })
//     }, [])
// }

export function Text() {
    //const { state } = useContext(appContext)
    //FetchTextToHighlight()

    return (
        <TextStyled id="text">
            {/* {state.MirAnn ? <TextComponent /> : <Loading />} */}
            <TextComponent />
        </TextStyled>
    )
}