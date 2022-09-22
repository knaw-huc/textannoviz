import React, { useContext } from "react"
import { appContext } from "../../state/context"

export function TextComponent() {
    const { state } = useContext(appContext)
    return (
        <>
            {state.text ? state.text.lines.join("\n") : null}
        </>
    )
}