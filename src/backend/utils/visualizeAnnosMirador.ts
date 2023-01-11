import mirador from "mirador";
import {
  AnnoRepoAnnotation,
  iiifAnn,
  iiifAnnResources,
} from "../../model/AnnoRepoAnnotation";
import { BroccoliV2 } from "../../model/Broccoli";
import { findSvgSelector } from "../utils/findSvgSelector";
import { svgStyler } from "../utils/svgStyler";
import { findImageRegions } from "./findImageRegions";

export const visualizeAnnosMirador = (
  broccoli: BroccoliV2,
  store: any,
  canvasId: string
): iiifAnn => {
  const currentState = store.getState();
  const iiifAnn: iiifAnn = {
    "@id": "republic",
    "@context": "http://iiif.io/api/presentation/2/context.json",
    "@type": "sc:AnnotationList",
    resources: [],
  };

  const regions = broccoli.anno.flatMap((item: AnnoRepoAnnotation) => {
    const region = findImageRegions(item, canvasId);

    if (region !== null) {
      return region;
    } else {
      console.log(item.body.id + " region is undefined");
      return null;
    }
  });

  const resources = regions.flatMap((region: string | null, i: number) => {
    if (region === null) {
      return;
    }
    const [x, y, w, h] = (region as string).split(",");
    let colour: string;

    switch (broccoli.anno[i].body.type) {
      case "Resolution":
        colour = "green";
        break;
      case "Attendant":
        colour = "#DB4437";
        break;
      case "Reviewed":
        colour = "blue";
        break;
      case "AttendanceList":
        colour = "yellow";
        break;
      default:
        colour = "white";
    }

    const iiifAnnResources: iiifAnnResources[] = [
      {
        "@id": `${broccoli.anno[i].id}`,
        "@type": "oa:Annotation",
        motivation: ["oa:commenting", "oa:Tagging"],
        on: [
          {
            "@type": "oa:SpecificResource",
            full: `${currentState.windows.republic.canvasId}`,
            selector: {
              "@type": "oa:Choice",
              default: {
                "@type": "oa:FragmentSelector",
                value: `xywh=${x},${y},${w},${h}`,
              },
              item: {
                "@type": "oa:SvgSelector",
                value: svgStyler(
                  findSvgSelector(broccoli.anno[i], canvasId),
                  colour
                ),
              },
            },
            within: {
              "@id": `${broccoli.iiif.manifest}`,
              "@type": "sc:Manifest",
            },
          },
        ],
        resource: [
          {
            "@type": "dctypes:Text",
            format: "text/html",
            chars: `${broccoli.anno[i].body.type}`,
          },
          {
            "@type": "oa:Tag",
            format: "text/html",
            chars: `${broccoli.anno[i].body.type}`,
          },
        ],
      },
    ];

    return iiifAnnResources;
  });
  iiifAnn.resources.push(...resources);

  const res = store.dispatch(
    mirador.actions.receiveAnnotation(
      `${currentState.windows.republic.canvasId}`,
      "annotation",
      iiifAnn
    )
  );
  console.log(res);

  return iiifAnn;
};
