import { AnnoRepoAnnotation, SvgSelectorTarget } from "../../model/AnnoRepoAnnotation"

export const findSvgSelector = (annotation: AnnoRepoAnnotation, context: string): string => {
    // const svg = (annotation.target as SvgSelectorTarget[])
    //     .find((svg: SvgSelectorTarget) => ["SvgSelector"]
    //         .includes(svg.selector.type)) as SvgSelectorTarget
    
    // return svg.selector.value

    const svg = (annotation.target as SvgSelectorTarget[])
        .filter(t => t.selector && t.selector.type === "SvgSelector")
        .filter(t => t.source.includes(context))
        .map(t => t.selector.value)

    return svg.toString()
}