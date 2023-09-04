import mirador from "mirador";
import {
  AnnoRepoAnnotation,
  iiifAnn,
  iiifAnnResources,
} from "../model/AnnoRepoAnnotation";
import { ProjectConfig } from "../model/ProjectConfig";
import { findSvgSelector } from "../utils/findSvgSelector";
import { svgStyler } from "../utils/svgStyler";
import { findImageRegions } from "./findImageRegions";

export const visualizeAnnosMirador = (
  annotations: AnnoRepoAnnotation[],
  store: any,
  canvasId: string,
  projectConfig: ProjectConfig,
): iiifAnn => {
  const currentState = store.getState && store.getState();
  const iiifAnn: iiifAnn = {
    "@id": projectConfig.id,
    "@context": "http://iiif.io/api/presentation/2/context.json",
    "@type": "sc:AnnotationList",
    resources: [],
  };

  const regions = annotations.flatMap((item: AnnoRepoAnnotation) => {
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
    let colour: string;

    if (projectConfig.id === "republic") {
      switch (annotations[i].body.type) {
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
        case "TextRegion":
          colour = projectConfig.colours.textregion;
          break;
        default:
          colour = "white";
      }
    } else {
      switch (annotations[i].body.type) {
        case "px:TextRegion":
          colour = projectConfig.colours.textregion;
          break;
        case "px:TextLine":
          colour = projectConfig.colours.textline;
          break;
        case "tt:Entity":
          colour = projectConfig.colours.entity;
          break;
        default:
          colour = "blue";
      }
    }

    const iiifAnnResources: iiifAnnResources[] = [
      {
        "@id": `${annotations[i].body.id}`,
        on: [
          {
            full: `${
              projectConfig.id === "republic"
                ? currentState.windows.republic.canvasId
                : currentState.windows.globalise.canvasId
            }`,
            selector: {
              item: {
                "@type": "oa:SvgSelector",
                value: svgStyler(
                  findSvgSelector(annotations[i], canvasId),
                  colour,
                ),
              },
            },
          },
        ],
      },
    ];

    return iiifAnnResources;
  });
  iiifAnn.resources.push(...resources);

  store.dispatch(
    mirador.actions.receiveAnnotation(
      `${
        projectConfig.id === "republic"
          ? currentState.windows.republic.canvasId
          : currentState.windows.globalise.canvasId
      }`,
      "annotation",
      iiifAnn,
    ),
  );

  return iiifAnn;
};
