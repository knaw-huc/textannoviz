import { BroccoliTextGeneric } from "../../../../model/Broccoli.ts";
import { useAnnotationStore } from "../../../../stores/annotation.ts";
import { AnnotatedText, TextOffsets } from "../core";
import { createSearchHighlightOffsets } from "./utils/createSearchHighlightOffsets.ts";
import "./annotated.css";
import {
  projectConfigSelector,
  useProjectStore,
} from "../../../../stores/project.ts";
import {
  createAnnotationTextOffsets,
  createMarkerTextOffsets,
  findRelativePosition,
} from "./utils/createTextOffsets.ts";
import { createSearchRegex } from "../../createSearchRegex.tsx";
import { useDetailNavigation } from "../../../Detail/useDetailNavigation.tsx";
import uniq from "lodash/uniq";
import {
  hasMarkerPositions,
  isMarker,
  ProjectMarkerAnnotation,
} from "./ProjectMarkerAnnotation.tsx";
import { ProjectNestedAnnotation } from "./ProjectNestedAnnotation.tsx";
import { ProjectHighlightAnnotations } from "./ProjectHighlightAnnotations.tsx";
import { ProjectSegmentGroup } from "./ProjectSegmentGroup.tsx";
import { WithRelativePosition } from "./WithRelativePosition.ts";

type TextHighlightingProps = {
  text: BroccoliTextGeneric;
  showDetail: boolean;
};

export const ProjectAnnotatedText = (props: TextHighlightingProps) => {
  const projectConfig = useProjectStore(projectConfigSelector);
  const { entityAnnotationTypes, highlightedAnnotationTypes } = projectConfig;
  const typesToInclude = uniq([
    ...entityAnnotationTypes,
    ...highlightedAnnotationTypes,
  ]);
  const annotations = useAnnotationStore().annotations.filter((a) => {
    if (typesToInclude.includes(a.body.type)) {
      return true;
    }
    if (isMarker(a, projectConfig)) {
      return true;
    }
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
  const textBody = props.text.body;
  const offsets: TextOffsets[] = [];

  const nestedAnnotationTypes = [...entityAnnotationTypes];
  const nestedAnnotations = withRelative
    .filter((a) => nestedAnnotationTypes.includes(a.annotation.body.type))
    .filter(({ relative }) => !hasMarkerPositions(relative))
    .map(({ annotation, relative }) =>
      createAnnotationTextOffsets(annotation, relative, "annotation"),
    );
  offsets.push(...nestedAnnotations);
  const highlightedAnnotations = withRelative
    .filter(({ annotation }) =>
      highlightedAnnotationTypes.includes(annotation.body.type),
    )
    .filter(({ relative }) => !hasMarkerPositions(relative))
    .map(({ annotation, relative }) =>
      createAnnotationTextOffsets(annotation, relative, "highlight"),
    );
  offsets.push(...highlightedAnnotations);

  const searchHighlight = createSearchRegex(searchTerms, tier2);
  offsets.push(...createSearchHighlightOffsets(textBody, searchHighlight));

  const markerAnnotations = withRelative
    .filter(({ annotation }) => isMarker(annotation, projectConfig))
    .map(({ annotation, relative }) =>
      createMarkerTextOffsets(annotation, relative),
    );
  offsets.push(...markerAnnotations);

  return (
    <div className="whitespace-pre-wrap">
      <AnnotatedText
        config={{
          Annotation: ProjectNestedAnnotation,
          Highlight: ProjectHighlightAnnotations,
          Marker: ProjectMarkerAnnotation,
          Group: ProjectSegmentGroup,
        }}
        body={textBody}
        offsets={offsets}
      />
    </div>
  );
};
