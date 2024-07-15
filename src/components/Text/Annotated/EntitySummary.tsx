import { EntityBody } from "../../../model/AnnoRepoAnnotation.ts";
import { trimMiddle } from "./utils/trimMiddle.ts";

export function EntitySummary(props: { body: EntityBody }) {
  const { body } = props;
  return (
    <li className="mb-6 flex flex-col gap-2 border-b border-neutral-200 pb-6">
      <div className="">
        <div className="underlined-per annotationMarker text-sm italic">
          {body.metadata.category}
        </div>
        <div className="">{trimMiddle(body.text, 120)}</div>
      </div>
      <div className="flex gap-4">
        <div className="">
          <button className="rounded border border-neutral-300  px-3 py-1 text-sm transition hover:bg-neutral-200">
            Zoek naar deze commissie
          </button>
          <div className="mt-2 text-xs italic text-neutral-600">
            Let op: dit start een nieuwe zoekactie
          </div>
        </div>

        <div className="">
          <button className="rounded border border-neutral-300 px-3 py-1 text-sm transition hover:bg-neutral-200">
            Meer informatie over deze commissie
          </button>
        </div>
      </div>
    </li>
  );
}
