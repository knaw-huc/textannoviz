//import { ElucidateAnnotation } from "../model/ElucidateAnnotation"
import React from "react"
import getBodyValue from "../backend/utils/getBodyValue"
import Linkify from "linkify-react"

type AnnotationContentProps = {
    ann: any | undefined
}

export function AnnotationItemContent(props: AnnotationContentProps) {
    const ann = props.ann
    const [showFull, setShowFull] = React.useState(false)
    const options = {
        target: "_blank"
    }

    return (
        <>
            {ann && <div id="annotation-content">
                <ul>
                    <li>id: <br /><code>{ann.id}</code></li>
                    <li>type: <br /><code>{getBodyValue(ann)}</code></li>
                    <Linkify tagName="link-raa" options={options}>
                        <li>{getBodyValue(ann) === "attendant" ? `Link to RAA: https://switch.sd.di.huc.knaw.nl/raa/persoon/${ann.body[1].value["http://example.org/customwebannotationfield#delegate_id"]}` : ""}</li>
                    </Linkify>
                    <li>
                        <button className="show-full" onClick={(e) => {
                            e.stopPropagation()
                            setShowFull(!showFull)
                        }}>full annotation {String.fromCharCode(showFull ? 9663 : 9657)}</button>
                        <br />
                        {showFull && <pre className="annotation-preview">
                            {JSON.stringify(ann, null, 2)}
                        </pre>}
                    </li>
                </ul>

            </div>}
        </>
    )

}