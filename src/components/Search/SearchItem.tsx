import { Link } from "react-router-dom";
import { SearchResult } from "../../model/Search";

interface SearchItemProps {
  result: SearchResult;
}

export const SearchItem = (props: SearchItemProps) => {
  return (
    <div className="searchItem">
      <Link to={`/detail/${props.result.bodyId}`}>
        <div className="searchItemTitle">
          <h3>{props.result.bodyType}</h3>
          <h3>
            {props.result.sessionWeekday} {props.result.sessionDay}
            {"-"}
            {props.result.sessionMonth}
            {"-"}
            {props.result.sessionYear}
          </h3>
          <h3>
            {props.result.propositionType && props.result.propositionType}
          </h3>
        </div>
      </Link>
      <ul className="searchItemTextPreview">
        {props.result.hits &&
          props.result.hits.map((hit, key) => (
            <li
              key={key}
              dangerouslySetInnerHTML={{ __html: hit.preview }}
            ></li>
          ))}
      </ul>
    </div>
  );
};
