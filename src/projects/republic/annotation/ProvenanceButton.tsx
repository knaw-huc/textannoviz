import { ArchiveIcon } from "../../../components/common/icons/ArchiveIcon.tsx";
import {
  translateProjectSelector,
  useProjectStore,
} from "../../../stores/project.ts";

export function ProvenanceButton(props: {
  className?: string;
  onClick: () => void;
}) {
  const translateProject = useProjectStore(translateProjectSelector);
  return (
    <button
      className={[
        "rounded-full border border-neutral-200 bg-white px-3 py-1 transition hover:bg-neutral-200",
        props.className,
      ].join(" ")}
      onClick={props.onClick}
      title={translateProject("PROVENANCE")}
    >
      <ArchiveIcon color="#ccc" />
    </button>
  );
}
