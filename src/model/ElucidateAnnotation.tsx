type AnnotatorBody = {
    "type": string | (string[]),
    "value": string,
}

export type Body = {
    "type": "TextualBody",
    "value": string,
    "purpose": string,
}

export type ElucidateBody = AnnotatorBody & {
    "id": string,
    "purpose": string,
}

export type Selector = {
    "type": string,
    "end": number,
    "start": number,
}

export type SelectorTarget = {
    "type": string,
    "selector": Selector,
    "source": string,
}

export type ImageTarget = {
    "type": "Image",
    "selector": {
        "type": string,
        "conformsTo": string,
        "value": string,
    } | undefined,
    "source": string,
}

export type TextAnchorTarget = {
    "type": "Text",
    "selector": {
        "type": "urn:example:republic:TextAnchorSelector",
        "end": number,
        "start": number,
    },
    "source": string
}

export type ElucidateTarget = SelectorTarget | ImageTarget

export type Target = string | TextAnchorTarget | ElucidateTarget

export type ElucidateAnnotation = {
    "id": string,
    "type": string,
    "generated": string,
    "generator": {
        "id": string,
        "type": string,
        "name": string,
    } | undefined,
    "body": Body | ElucidateBody | (ElucidateBody[]),
    "target": Target | Target[],
    "movivation": string
}