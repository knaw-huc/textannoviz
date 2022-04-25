import { ElucidateAnnotation, SelectorTarget } from '../../model/ElucidateAnnotation'

export default function findSelectorTarget(ann: ElucidateAnnotation) {
    return (ann.target as SelectorTarget[])
        .find((t: SelectorTarget) => [undefined, 'Text'].includes(t.type)) as SelectorTarget
}