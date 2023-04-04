import { Link } from "react-router-dom";
import { mockDataType } from "./Search";

interface SearchItemProps {
  result: mockDataType;
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
