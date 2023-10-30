import {
  AnnoRepoAnnotation,
  TeiRsBody,
} from "../../model/AnnoRepoAnnotation";

interface GetAnnotationItemContentProps {
  annotation: AnnoRepoAnnotation;
}

export const AnnotationItemContent = (
  props: GetAnnotationItemContentProps,
) => {
  function renderAnnotationItemContent() {
    switch (props.annotation.body.type) {
      case "tei:Rs":
        if ((props.annotation.body as TeiRsBody).metadata.anno) {
          return (
            <>
              <li>
                <strong>URL: </strong>
                <a
                  title="Link"
                  rel="noreferrer"
                  target="_blank"
                  href={(props.annotation.body as TeiRsBody).metadata.anno}
                >
                  {(props.annotation.body as TeiRsBody).metadata.anno}
                </a>
              </li>
              <li>
                <strong>Key:</strong>{" "}
                {(props.annotation.body as TeiRsBody).metadata.key}
              </li>
              <li>
                <strong>Type:</strong>{" "}
                {(props.annotation.body as TeiRsBody).metadata.type}
              </li>
            </>
          );
        } else {
          return (
            <>
              <li>
                <strong>Key:</strong>{" "}
                {(props.annotation.body as TeiRsBody).metadata.key}
              </li>
              <li>
                <strong>Type:</strong>{" "}
                {(props.annotation.body as TeiRsBody).metadata.type}
              </li>
            </>
          );
        }
      default:
        return props.annotation.body.metadata
          ? Object.entries(props.annotation.body.metadata).map(
              ([key, value], i) => {
                return <li key={i}>{`${key}: ${value}`}</li>;
              },
            )
          : null;
    }
  }

  return <>{renderAnnotationItemContent()}</>;
};
