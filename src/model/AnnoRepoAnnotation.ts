export type AnnoRepoBody = {
    id: string,
    type: string,
}

export type SessionBody = AnnoRepoBody & {
    metadata: {
        dateShiftStatus: string,
        hasSessionDateElement: boolean,
        inventoryNum: number,
        isWorkday: boolean,
        linesIncludeRestDay: boolean,
        resolutionIds: [],
        sessionDate: string,
        sessionDay: number,
        sessionMonth: number,
        sessionNum: number,
        sessionWeekday: string,
        sessionYear: number,
        textPageNum: number[]
    }
}

export type ResolutionBody = AnnoRepoBody & {
    metadata: {
        inventoryNum: number,
        sourceId: string,
        sessionDate: string,
        sessionId: string,
        sessionNum: number,
        president: null,
        sessionYear: number,
        sessionMonth: number,
        sessionDay: number,
        sessionWeekday: string,
        propositionType: string,
        proposer: null,
        decision: null,
        resolutionType: string,
        textPageNum: number[],
        propositionOrigin: {
            location: {
                text: string
            }
        },
        propositionOrganisation: string,
        proposerRole: string
    }
}

export type ReviewedBody = AnnoRepoBody & {
    metadata: {
        inventoryNum: number,
        sourceId: string,
        textPageNum: number[],
        pageNum: number[],
        startOffset: number,
        iiifUrl: string,
        docId: string,
        lang: string,
        paragraphIndex: number
    },
    text: string
}

export type AttendanceListBody = AnnoRepoBody & {
    metadata: {
        inventoryNum: number,
        sourceId: string,
        sessionDate: string,
        sessionId: string,
        sessionNum: number,
        sessionYear: number,
        sessionMonth: number,
        sessionDay: number,
        sessionWeekday: string,
        textPageNum: number[]
    },
    attendanceSpans: attendanceSpansType[]
}

type attendanceSpansType = {
    offset: number,
    end: number,
    class: string,
    pattern: string,
    delegateId: number,
    delegateName: string,
    delegateScore: number
}

export type AttendantBody = AnnoRepoBody & {
    metadata: {
        offset: number,
        end: number,
        class: string,
        pattern: string,
        delegateId: number,
        delegateName: string,
        delegateScore: number
    }
}

export type Body = AnnoRepoBody | SessionBody | ResolutionBody | ReviewedBody | AttendanceListBody | AttendantBody

export type ImageTarget = {
    type: "Image",
    selector: {
        type: string,
        conformsTo: string,
        value: string,
    } | undefined,
    source: string,
}

export type SvgSelectorTarget = {
    source: string,
    type: "Image",
    selector: {
        type: "SvgSelector",
        value: string
    }
}

export type TextAnchorTarget = {
    source: string,
    type: "Text",
    selector: {
        type: "urn:republic:TextAnchorSelector",
        end: number,
        start: number,
        beginCharOffset: number,
        endCharOffset: number
    },
}

export type TextTarget = {
    source: string,
    type: "Text"
}

export type Target = TextAnchorTarget | ImageTarget | TextTarget | SvgSelectorTarget

export type AnnoRepoAnnotation = {
    id: string,
    body: AnnoRepoBody
    target: Target | Target[],
    movivation: string
}

type iiifAnnResource = {
    "@type": string,
    "format": string,
    "chars": string
}

export type iiifAnnResources = {
    "@id": string,
    "@type": string,
    "motivation": string[]
    "on": [{
        "@type": string,
        "full": string,
        "selector": {
            "@type": string,
            "default": {
                "@type": string,
                "value": string
            },
            "item"?: {
                "@type": string,
                "value": string
            }
        },
        "within": {
            "@id": string,
            "@type": string
        }
    }],
    "resource": iiifAnnResource[]
} | undefined

export type iiifAnn = {
    "@context": string,
    "@id": string,
    "@type": string,
    "resources": iiifAnnResources[]
}