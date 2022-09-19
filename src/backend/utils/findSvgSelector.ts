import { AnnoRepoAnnotation, CanvasTarget, SvgSelector } from "../../model/AnnoRepoAnnotation"

export const findSvgSelector = (annotation: AnnoRepoAnnotation, context: string): string => {
    // const svg = (annotation.target as SvgSelectorTarget[])
    //     .find((svg: SvgSelectorTarget) => ["SvgSelector"]
    //         .includes(svg.selector.type)) as SvgSelectorTarget
    
    // return svg.selector.value

    const svg = (annotation.target as CanvasTarget[])
        .filter(t => t.source.includes(context))
        .flatMap(t => t.selector && t.selector.filter(t => t.type === "SvgSelector"))
        .filter(t => t !== undefined)

    return (svg[0] as SvgSelector).value
}