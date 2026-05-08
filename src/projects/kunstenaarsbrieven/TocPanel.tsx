import { useViewText } from "../../components/Text/useViewText.tsx";
import { useAnnotationStore } from "../../stores/annotation.ts";
import {
  projectConfigSelector,
  useProjectStore,
} from "../../stores/project.ts";
import { isHeadBody } from "./annotation/ProjectAnnotationModel.ts";
import { getTocId, getTocLevel } from "./TocUtils.ts";
import { orThrow } from "../../utils/orThrow.tsx";
import { Toc, TocHeader } from "../../components/Text/Toc/Toc.tsx";

import { mapRelativePositions } from "../../components/Text/Annotated/utils/mapRelativePositions.ts";

export const TocPanel = () => {
  const projectConfig = useProjectStore(projectConfigSelector);
  const text = useViewText(`text.${projectConfig.selectedLanguage}`);
  const annotations = useAnnotationStore((s) => s.annotations);

  if (!text) {
    return null;
  }

  const relativePositions = text.locations.annotations;
  const relativePositionMap = mapRelativePositions(relativePositions);

  const tocHeaders: TocHeader[] = [];

  for (const annotation of annotations) {
    if (!isHeadBody(annotation.body)) {
      continue;
    }
    const relative = relativePositionMap.get(annotation.body.id);
    if (!relative) {
      continue;
    }
    const id =
      getTocId(annotation.body) ??
      orThrow(`No toc id found for ${annotation.id}`);
    const n = (isHeadBody(annotation.body) && annotation.body.n) || undefined;
    const titleText = text.body.slice(relative.begin, relative.end);
    const label = n ? `${n}. ${titleText}` : titleText;
    const level = getTocLevel(n) ?? 0;
    if (label) {
      tocHeaders.push({ id, label, level });
    }
  }

  return <Toc headers={tocHeaders} />;
};
