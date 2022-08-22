import React, { useContext } from "react"
import { appContext } from "../../state/context"

export function TextHighlighting() {
    const { state } = useContext(appContext)
    const [textToMark, setTextToMark] = React.useState(null)
    console.log("text component begins")

    React.useEffect(() => {
        if (state.annItemOpen === true) {
            console.log("IF STATEMENT TRUE")
            const markElement = `<mark>${textToMark.slice(state.textToHighlight.start.line, state.textToHighlight.end.line + 1).join("\n")}</mark>`
            console.log(markElement)
            textToMark.splice(state.textToHighlight.start.line, state.textToHighlight.end.offset, markElement)
            console.log(textToMark)
        } else {
            setTextToMark(state.text)
            console.log("IF IS FALSE")
            console.log(textToMark)
            console.log(state.text)
        }
    }, [state.annItemOpen, state.text])

    //Warning: "dangerouslySetInnerHTML" is susceptible to XSS attacks. This might fix it: https://www.npmjs.com/package/dompurify
    return (
        <span dangerouslySetInnerHTML={{ __html: textToMark.join("\n") }} />
    )
}