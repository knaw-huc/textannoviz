import { AnnoRepoAnnotation, SelectorTarget } from "../../model/AnnoRepoAnnotation"

export default function findSelectorTarget(ann: AnnoRepoAnnotation) {
    return (ann.target as SelectorTarget[])
        .find((t: SelectorTarget) => [undefined, "Text"].includes(t.type)) as SelectorTarget
}