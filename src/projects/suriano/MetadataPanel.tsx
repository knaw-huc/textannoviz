import {
  AnnoRepoAnnotation,
  SurianoTfFileBody,
} from "../../model/AnnoRepoAnnotation";
import {
  translateProjectSelector,
  translateSelector,
  useProjectStore,
} from "../../stores/project";

type MetadataPanelProps = {
  annotations: AnnoRepoAnnotation[];
};

export const MetadataPanel = (props: MetadataPanelProps) => {
  const translate = useProjectStore(translateSelector);
  const translateProject = useProjectStore(translateProjectSelector);

  const fileAnno = props.annotations.find(
    (anno) => anno.body.type === "tf:File",
  );

  const gridOneColumn = "grid grid-cols-1";
  const dateOptions: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  return (
    <>
      <ul className="m-0 list-none p-0">
        <li className="mb-8">
          <strong>{translateProject("summary")}</strong>
          <div className={gridOneColumn}>
            {(fileAnno?.body as SurianoTfFileBody).metadata.summary}
          </div>
        </li>
        <li className="mb-8">
          <strong>{translate("DATE")}</strong>
          <div className={gridOneColumn}>
            {new Date(
              (fileAnno?.body as SurianoTfFileBody).metadata.date,
            ).toLocaleDateString("en-GB", dateOptions)}
          </div>
        </li>
        <li className="mb-8">
          <strong>{translateProject("senderLoc")}</strong>
          <div className={gridOneColumn}>
            {(fileAnno?.body as SurianoTfFileBody).metadata.senderLoc}
          </div>
        </li>
        <li className="mb-8">
          <strong>{translateProject("recipientLoc")}</strong>
          <div className={gridOneColumn}>
            {(fileAnno?.body as SurianoTfFileBody).metadata.recipientLoc}
          </div>
        </li>
        <li className="mb-8">
          <strong>{translateProject("shelfmark")}</strong>
          <div className={gridOneColumn}>
            {(fileAnno?.body as SurianoTfFileBody).metadata.shelfmark}
          </div>
        </li>
      </ul>
    </>
  );
};
