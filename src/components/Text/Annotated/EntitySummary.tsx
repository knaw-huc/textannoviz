import { EntityBody } from "../../../model/AnnoRepoAnnotation.ts";
import { trimMiddle } from "./utils/trimMiddle.ts";

export function EntitySummary(props: { body: EntityBody }) {
  const { body } = props;
  return (
    <li className="annotation-summary">
      <ul>
        <span className="name-summary">
          {trimMiddle(body.text, 120)} ({body.metadata.category})
        </span>
        <li>
          <a target="_blank" href="/">
            Resoluties met
          </a>
        </li>
        <li>
          <a target="_blank" href="https://entity.sd.di.huc.knaw.nl/" rel="noreferrer">
            Entity browser
          </a>
        </li>
      </ul>
    </li>
  );
}
