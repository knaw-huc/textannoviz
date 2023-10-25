import {
  AnnoRepoAnnotation,
  AnnoRepoBody,
} from "../../model/AnnoRepoAnnotation";

interface GetAnnotationItemProps {
  annotation: AnnoRepoAnnotation;
}

type TextBody = AnnoRepoBody & {
  text: string;
};

export type EntityBody = AnnoRepoBody &
  TextBody & {
    url: string;
    class_name: string;
    class_description: string;
  };

export const AnnotationItemContent = (props: GetAnnotationItemProps) => {
  const textBody = props.annotation.body as TextBody;
  const entityBody = props.annotation.body as EntityBody;

  return (
    <>
      {props.annotation && (
        <>
          {(() => {
            switch (props.annotation.body.type) {
              case "px:TextLine":
              case "px:TextRegion":
              case "tt:Paragraph":
                if (!textBody.text) return;
                return (
                  <li style={{ width: "350px" }}>
                    <strong>Text:</strong> {textBody.text}
                  </li>
                );

              case "tt:Entity":
                if (!entityBody.url) return;
                return (
                  <>
                    <li>
                      <strong>URL:</strong>{" "}
                      <a
                        title="Link"
                        rel="noreferrer"
                        target="_blank"
                        href={entityBody.url}
                      >
                        {entityBody.url}
                      </a>
                    </li>
                    <li>
                      <strong>Class name:</strong> {entityBody.class_name}
                    </li>
                    <li>
                      <strong>Class description:</strong>{" "}
                      {entityBody.class_description}
                    </li>
                    <li>
                      <strong>Text:</strong> {entityBody.text}
                    </li>
                  </>
                );
              default:
                return;
            }
          })()}
        </>
      )}
    </>
  );
};
