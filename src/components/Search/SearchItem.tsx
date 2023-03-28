import { mockDataType } from "./Search";

interface SearchItemProps {
  result: mockDataType;
}

export const SearchItem = (props: SearchItemProps) => {
  return (
    <div className="searchItem">
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
      <ul className="searchItemTextPreview">
        {props.result.hits.map((hit, key) => (
          <li key={key} dangerouslySetInnerHTML={{ __html: hit.preview }}></li>
        ))}
      </ul>
    </div>
  );
};
