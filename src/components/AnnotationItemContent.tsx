//import { ElucidateAnnotation } from "../model/ElucidateAnnotation"
import React from "react"
import getBodyValue from "../backend/utils/getBodyValue"
import getAttendantInfo from "../backend/utils/getAttendantInfo"
import getResolutionInfo from "../backend/utils/getResolutionInfo"
import { HOSTS } from "../Config"
import { ElucidateAnnotation } from "../model/ElucidateAnnotation"

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
                    <li>Annotation ID: <br /><code>{ann.id}</code></li>
                    {getBodyValue(ann) === "attendant" ? <li>Attendant ID: <br /><code><a title="Link to RAA" rel="noreferrer" target="_blank" href={`${HOSTS.RAA}/${getAttendantInfo(ann, "http://example.org/customwebannotationfield#delegate_id")}`}>{getAttendantInfo(ann, "http://example.org/customwebannotationfield#delegate_id")}</a></code></li> : null}
                    {getBodyValue(ann) === "attendant" ? <li>Attendant name: <br /><code>{getAttendantInfo(ann, "http://example.org/customwebannotationfield#delegate_name")}</code></li> : null}
                    {getBodyValue(ann) === "resolution" ? <li>Proposition type: <br /><code>{getResolutionInfo(ann, "http://example.org/customwebannotationfield#proposition_type")}</code></li> : null}
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