//import { ElucidateAnnotation } from "../model/ElucidateAnnotation"
import React from "react"
import getBodyValue from "../backend/utils/getBodyValue"
import getAttendantName from "../backend/utils/getAttendantInfo"
import getResolutionInfo from "../backend/utils/getResolutionInfo"
import { HOSTS } from "../Config"
import { AnnoRepoAnnotation } from "../model/AnnoRepoAnnotation"
import styled from "styled-components"

type AnnotationContentProps = {
    ann: AnnoRepoAnnotation | undefined
}

const AnnPreview = styled.div`
    overflow: auto;
`

export function AnnotationItemContent(props: AnnotationContentProps) {
    const ann = props.ann
    const [showFull, setShowFull] = React.useState(false)

    return (
        <>
            {ann && <div id="annotation-content">
                <ul>
                    {/* <li>Annotation ID: <br /><code>{ann.id}</code></li> */}
                    {getBodyValue(ann) === "attendant" ? <li>Attendant ID: <br /><code><a title="Link to RAA" rel="noreferrer" target="_blank" href={`${HOSTS.RAA}/${getAttendantName(ann, "http://example.org/customwebannotationfield#delegate_id")}`}>{getAttendantName(ann, "http://example.org/customwebannotationfield#delegate_id")}</a></code></li> : null}
                    {getBodyValue(ann) === "attendant" ? <li>Attendant name: <br /><code>{getAttendantName(ann, "http://example.org/customwebannotationfield#delegate_name")}</code></li> : null}
                    {getBodyValue(ann) === "resolution" ? <li>Proposition type: <br /><code>{getResolutionInfo(ann, "http://example.org/customwebannotationfield#proposition_type")}</code></li> : null}
                    {getBodyValue(ann) === "session" ? <li>Date: <br /><code>{getAttendantName(ann, "http://example.org/customwebannotationfield#date")}</code></li> : null}
                    {getBodyValue(ann) === "session" ? <li>Weekday: <br /><code>{getAttendantName(ann, "http://example.org/customwebannotationfield#weekday")}</code></li> : null}
                    <li>
                        <button className="show-full" onClick={(e) => {
                            e.stopPropagation()
                            setShowFull(!showFull)
                        }}>full annotation {String.fromCharCode(showFull ? 9663 : 9657)}</button>
                        <br />
                        <AnnPreview id="annotation-preview">
                            {showFull && <pre>
                                {JSON.stringify(ann, null, 2)}
                            </pre>}
                        </AnnPreview>
                    </li>
                </ul>

            </div>}
        </>
    )

}