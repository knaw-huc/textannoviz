import { useViewText } from "../../components/Text/useViewText.tsx";
import { useAnnotationStore } from "../../stores/annotation.ts";
import {
  projectConfigSelector,
  useProjectStore,
} from "../../stores/project.ts";
import { findRelativePosition } from "../../components/Text/Annotated/project/utils/createTextOffsets.ts";
import { WithRelativePosition } from "../../components/Text/Annotated/project/WithRelativePosition.ts";
import { HeadBody, isHeadBody } from "./annotation/ProjectAnnotationModel.ts";
import { getTocId, getTocLevel } from "./TocUtils.ts";
import { orThrow } from "../../components/Text/Annotated/project/utils/orThrow.tsx";
import { Toc, TocHeader } from "../../components/Text/Toc/Toc.tsx";

export const TocPanel = () => {
  const projectConfig = useProjectStore(projectConfigSelector);
  const text = useViewText(`text.${projectConfig.selectedLanguage}`);
  const annotations = useAnnotationStore((s) => s.annotations);

  if (!text) {
    return null;
  }

  const relativePositions = text.locations.annotations;
  const withRelative = annotations
    .map((annotation) => {
      const relative = findRelativePosition(annotation, relativePositions);
      return { annotation, relative };
    })
    .filter((a): a is WithRelativePosition => !!a.relative);

  const headers = withRelative.filter(({ annotation: a }) =>
    isHeadBody(a.body),
  ) as unknown as WithRelativePosition<HeadBody>[];

  const tocHeaders: TocHeader[] = headers.map((header) => {
    const id =
      getTocId(header.annotation.body) ??
      orThrow(`No toc id found for ${header.annotation.id}`);
    const { begin, end } = header.relative;
    const label = text.body.slice(begin, end);
    const level = getTocLevel(header.annotation.body.n) ?? 0;
    return { id, label, level };
  });

  return <Toc headers={tocHeaders} />;
};
