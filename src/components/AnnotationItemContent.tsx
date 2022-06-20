import { ElucidateAnnotation } from "../model/ElucidateAnnotation"
import React from "react"
import getBodyValue from "../backend/utils/getBodyValue"

type AnnotationContentProps = {
    ann: ElucidateAnnotation | undefined
}

export function AnnotationItemContent(props: AnnotationContentProps) {
    const ann = props.ann
    const [showFull, setShowFull] = React.useState(false)

    return (
        <>
            {ann && <div id="annotation-content">
                <ul>
                    <li>id: <br /><code>{ann.id}</code></li>
                    <li>type: <br /><code>{getBodyValue(ann)}</code></li>
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