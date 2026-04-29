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
import { WithRelativePosition } from "../../../model/WithRelativePosition.ts";
import {
  createBlockTextOffsets,
  createGroupedAnnotationTextOffsets,
  createMarkerTextOffsets,
  findRelativePosition,
} from "./utils/createTextOffsets.ts";
import { AnnotatedText, TextOffsets } from "./core";
import { createSearchHighlightOffsets } from "./utils/createSearchHighlightOffsets.ts";
import { EntityModal } from "./EntityModal.tsx";
import { orThrow } from "../../../utils/orThrow.tsx";
import { tableTypes } from "../../../projects/kunstenaarsbrieven/annotation/ProjectAnnotationModel.ts";

type TextHighlightingProps = {
  text: BroccoliTextGeneric;
  showDetail: boolean;
};

export const ProjectAnnotatedText = (props: TextHighlightingProps) => {
  const projectConfig = useProjectStore(projectConfigSelector);
  const { nestedTypes, highlightTypes, isMarker, isBlock, getBlockType } =
    projectConfig;
  const typesToInclude = uniq([...nestedTypes, ...highlightTypes]);
  const annotations = useAnnotationStore().annotations.filter((a) => {
    if (typesToInclude.includes(a.body.type)) {
      return true;
    }
    return isBlock(a.body) || isMarker(a.body);
  });
  const withRelative: WithRelativePosition[] = annotations
    .map((annotation) => {
      const relativePositions = props.text.locations.annotations;
      const relative = findRelativePosition(annotation, relativePositions);
      return { annotation, relative };
    })
    .filter((toTest): toTest is WithRelativePosition => !!toTest.relative);

  const { tier2, highlight } = useDetailNavigation().getDetailParams();
  const searchTerms = highlight;
  const textBody = props.text.body || orThrow("No text body");
  const offsets: TextOffsets[] = [];

  const nestedAnnotations = withRelative
    // Some nested annotations are markers, need to be filtered out:
    // TODO: replace types + offset filter with projectConfig.isNested
    .filter((a) => nestedTypes.includes(a.annotation.body.type))
    .filter(({ relative }) => relative.begin !== relative.end)
    .map(({ annotation, relative }) =>
      createGroupedAnnotationTextOffsets(annotation, relative, "nested"),
    );
  offsets.push(...nestedAnnotations);
  const highlightedAnnotations = withRelative
    // Some highlights are markers, need to be filtered out:
    // TODO: replace types + offset filtering with projectConfig.isHighlight
    .filter(({ annotation }) => highlightTypes.includes(annotation.body.type))
    .filter(({ relative }) => relative.begin !== relative.end)
    .map(({ annotation, relative }) =>
      createGroupedAnnotationTextOffsets(annotation, relative, "highlight"),
    );
  offsets.push(...highlightedAnnotations);

  const searchHighlight = createSearchRegex(searchTerms, tier2);
  offsets.push(...createSearchHighlightOffsets(textBody, searchHighlight));

  const markerAnnotations = withRelative
    .filter(({ annotation }) => isMarker(annotation.body))
    .map(({ annotation, relative }) =>
      createMarkerTextOffsets(annotation, relative),
    );
  offsets.push(...markerAnnotations);
  const blockAnnotations = withRelative
    .filter(({ annotation }) => isBlock(annotation.body))
    .map(({ annotation, relative }) => {
      const blockType = getBlockType(annotation.body);
      return createBlockTextOffsets(annotation, relative, blockType);
    });
  offsets.push(...blockAnnotations);

  const tableAnnotations = annotations.filter((a) =>
    tableTypes.includes(a.body.type),
  );
  console.log(ProjectAnnotatedText.name, { annotations, tableAnnotations });

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
