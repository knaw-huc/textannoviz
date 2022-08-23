import { AnnoRepoAnnotation, SvgSelectorTarget } from "../../model/AnnoRepoAnnotation"

export const findSvgSelector = (annotation: AnnoRepoAnnotation): string => {
    const svg = (annotation.target as SvgSelectorTarget[])
        .find((svg: SvgSelectorTarget) => ["SvgSelector"]
            .includes(svg.selector.type)) as SvgSelectorTarget
    
    return svg.selector.value
}