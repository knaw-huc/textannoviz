import { BroccoliV2 } from "../../model/Broccoli"
import { iiifAnn, iiifAnnResources, AnnoRepoAnnotation } from "../../model/AnnoRepoAnnotation"
import { findImageRegions } from "./findImageRegions"
import mirador from "mirador"
import { findSvgSelector } from "../utils/findSvgSelector"
import { svgStyler } from "../utils/svgStyler"

export const visualizeAnnosMirador = (broccoli: BroccoliV2, store: any, canvasId: string): iiifAnn => {
    const currentState = store.getState()
    const iiifAnn: iiifAnn = {
        "@id": "https://images.diginfra.net/api/annotation/getTextAnnotations?uri=https%3A%2F%2Fimages.diginfra.net%2Fiiif%2FNL-HaNA_1.01.02%2F3783%2FNL-HaNA_1.01.02_3783_0285.jpg",
        "@context": "http://iiif.io/api/presentation/2/context.json",
        "@type": "sc:AnnotationList",
        "resources": []
    }

    const regions = broccoli.anno.flatMap((item: AnnoRepoAnnotation) => {
        const region = findImageRegions(item, canvasId)

        if (region !== undefined) {
            return region
        } else {
            console.log(item.body.id + " region is undefined")
        }
    })

    const resources = regions.flatMap((region: string, i: number) => {
        const [x, y, w, h] = region.split(",")
        let colour: string

        switch (broccoli.anno[i].body.type) {
        case "Resolution":
            colour = "green"
            break
        case "Attendant":
            colour = "#DB4437"
            break
        case "Reviewed":
            colour = "blue"
            break
        case "AttendanceList":
            colour = "yellow"
            break
        default:
            colour = "white"
        }

        const iiifAnnResources: iiifAnnResources[] = [{
            "@id": `${broccoli.anno[i].id}`,
            "@type": "oa:Annotation",
            "motivation": [
                "oa:commenting", "oa:Tagging"
            ],
            "on": [{
                "@type": "oa:SpecificResource",
                "full": `${currentState.windows.republic.canvasId}`,
                "selector": {
                    "@type": "oa:Choice",
                    "default": {
                        "@type": "oa:FragmentSelector",
                        "value": `xywh=${x},${y},${w},${h}`
                    },
                    "item": {
                        "@type": "oa:SvgSelector",
                        // "value": `<svg xmlns='http://www.w3.org/2000/svg'><path xmlns="http://www.w3.org/2000/svg" id="testing" d="M${x},${parseInt(y) + parseInt(h)}v-${h}h${w}v${h}z" stroke="${colour}" fill="${colour}" fill-opacity="0.5" stroke-width="1"/></svg>`
                        // "value": findSvgSelector(broccoli.anno[i])
                        "value": svgStyler(findSvgSelector(broccoli.anno[i], canvasId), colour)
                    }
                },
                "within": {
                    "@id": `${broccoli.iiif.manifest}`,
                    "@type": "sc:Manifest"
                }
            }],
            "resource": [{
                "@type": "dctypes:Text",
                "format": "text/html",
                "chars": `${broccoli.anno[i].body.type}`
            }, {
                "@type": "oa:Tag",
                "format": "text/html",
                "chars": `${broccoli.anno[i].body.type}`
            }]
        }]

        return iiifAnnResources
    })
    iiifAnn.resources.push(...resources)

    console.log(store.dispatch(mirador.actions.receiveAnnotation(`${currentState.windows.republic.canvasId}`, "annotation", iiifAnn)))

    return iiifAnn
    
}