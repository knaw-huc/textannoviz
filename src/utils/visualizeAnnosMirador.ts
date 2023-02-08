import mirador from "mirador";
import {
  AnnoRepoAnnotation,
  iiifAnn,
  iiifAnnResources
} from "../model/AnnoRepoAnnotation";
import { BroccoliV3 } from "../model/Broccoli";
import { ProjectConfig } from "../model/ProjectConfig";
import { findSvgSelector } from "../utils/findSvgSelector";
import { svgStyler } from "../utils/svgStyler";
import { findImageRegions } from "./findImageRegions";

export const visualizeAnnosMirador = (
  broccoli: BroccoliV3,
  store: any,
  canvasId: string,
  projectConfig: ProjectConfig
): iiifAnn => {
  const currentState = store.getState();
  const iiifAnn: iiifAnn = {
    "@id": projectConfig.id,
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

    if (projectConfig.id === "republic") {
      switch (broccoli.anno[i].body.type) {
        case "Resolution":
          colour = projectConfig.colours.resolution;
          break;
        case "Attendant":
          colour = projectConfig.colours.attendant;
          break;
        case "Reviewed":
          colour = projectConfig.colours.reviewed;
          break;
        case "AttendanceList":
          colour = projectConfig.colours.attendancelist;
          break;
        default:
          colour = "white";
      }
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

  store.dispatch(
    mirador.actions.receiveAnnotation(
      `${currentState.windows.republic.canvasId}`,
      "annotation",
      iiifAnn
    )
  );

  return iiifAnn;
};
