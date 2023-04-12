import { Link } from "react-router-dom";
import { SearchResultBody } from "../../model/Search";

interface SearchItemProps {
  result: SearchResultBody;
}

export const SearchItem = (props: SearchItemProps) => {
  return (
    <div className="searchItem">
      <Link to={`/detail/${props.result._id}`}>
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
        {props.result._hits &&
          props.result._hits.map((hit, key) => (
            <li
              key={key}
              dangerouslySetInnerHTML={{ __html: hit.preview }}
            ></li>
          ))}
      </ul>
    </div>
  );
};
