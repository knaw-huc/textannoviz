import React from "react"
import { useTextContext } from "./TextContext"

export function TextComponent() {
    const textState = useTextContext().state
    return (
        <>
            {textState.text ? textState.text.lines.join("\n") : null}
        </>
    )
}