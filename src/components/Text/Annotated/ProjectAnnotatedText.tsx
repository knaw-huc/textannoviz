import { BroccoliTextGeneric } from "../../../model/Broccoli.ts";
import { useAnnotationStore } from "../../../stores/annotation.ts";
import "./annotated.css";
import {
  projectConfigSelector,
  useProjectStore,
} from "../../../stores/project.ts";
import { createSearchRegex } from "../createSearchRegex.tsx";
import { useDetailNavigation } from "../../Detail/useDetailNavigation.tsx";
import uniq from "lodash/uniq";
import {
  createBlockTextOffsets,
  createTextOffsets,
  createMarkerTextOffsets,
} from "./utils/createTextOffsets.ts";
import { AnnotatedText, TextOffsets } from "./core";
import { createSearchHighlightOffsets } from "./utils/createSearchHighlightOffsets.ts";
import { EntityModal } from "./EntityModal.tsx";
import { orThrow } from "../../../utils/orThrow.tsx";
import { useMemo } from "react";
import { mapRelativePositions } from "./utils/mapRelativePositions.ts";

type TextHighlightingProps = {
  text: BroccoliTextGeneric;
  showDetail: boolean;
};

export const ProjectAnnotatedText = (props: TextHighlightingProps) => {
  const projectConfig = useProjectStore(projectConfigSelector);
  const { nestedTypes, highlightTypes, isMarker, isBlock, getBlockType } =
    projectConfig;
  const annotations = useAnnotationStore((s) => s.annotations);
  const { tier2, highlight } = useDetailNavigation().getDetailParams();
  const searchTerms = highlight;
  const textBody = props.text.body || orThrow("No text body");
  const relativeAnnotations = props.text.locations.annotations;

  const offsets = useMemo(() => {
    const typesToInclude = uniq([...nestedTypes, ...highlightTypes]);

    const relativePositionMap = mapRelativePositions(relativeAnnotations);

    const result: TextOffsets[] = [];

    for (const annotation of annotations) {
      const { body } = annotation;
      const isNested = nestedTypes.includes(body.type);
      const isHighlight = highlightTypes.includes(body.type);
      const isAnnotationBlock = isBlock(body);
      const isAnnotationMarker = isMarker(body);

      if (
        !isNested &&
        !isHighlight &&
        !isAnnotationBlock &&
        !isAnnotationMarker &&
        !typesToInclude.includes(body.type)
      ) {
        continue;
      }

      const relative = relativePositionMap.get(body.id);
      if (!relative) {
        continue;
      }

      if (isNested && relative.begin !== relative.end) {
        result.push(createTextOffsets(annotation, relative, "nested"));
      }
      if (isHighlight && relative.begin !== relative.end) {
        result.push(createTextOffsets(annotation, relative, "highlight"));
      }
      if (isAnnotationMarker) {
        result.push(createMarkerTextOffsets(annotation, relative));
      }
      if (isAnnotationBlock) {
        const blockType = getBlockType(body);
        result.push(createBlockTextOffsets(annotation, relative, blockType));
      }
    }

    const searchHighlight = createSearchRegex(searchTerms, tier2);
    result.push(...createSearchHighlightOffsets(textBody, searchHighlight));

    return result;
  }, [
    annotations,
    relativeAnnotations,
    nestedTypes,
    highlightTypes,
    isMarker,
    isBlock,
    getBlockType,
    searchTerms,
    tier2,
    textBody,
  ]);

  return (
    <div className="annotated-text whitespace-pre-wrap">
      <AnnotatedText
        components={projectConfig.annotatedTextComponents}
        text={textBody}
        offsets={offsets}
        blockSchema={projectConfig.blockSchema}
      >
        <EntityModal />
      </AnnotatedText>
    </div>
  );
};
