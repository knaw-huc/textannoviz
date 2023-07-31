import { Link } from "react-router-dom";
import { SearchResultBody } from "../../model/Search";

interface SearchItemProps {
  result: SearchResultBody;
}

export const SearchItem = (props: SearchItemProps) => {
  return (
    <ul>
      <li className="mb-3 text-base">
        {props.result.sessionWeekday}{" "}
        <strong className="font-semibold">
          {props.result.sessionDay}
          {"-"}
          {props.result.sessionMonth}
          {"-"}
          {props.result.sessionYear}
        </strong>
      </li>
      <Link
        to={`/detail/${props.result._id}`}
        className="hover:text-brand1-600 active:text-brand1-700 text-inherit no-underline"
      >
        <li className="divide-rpBrand1grey-100 border-rpBrand1grey-50 hover:divide-rpBrand1grey-200 hover:border-rpBrand1grey-200 mb-6 w-full cursor-pointer divide-y divide-solid rounded border bg-white shadow-sm transition hover:bg-white">
          <div className="p-4 font-semibold">{props.result.bodyType}</div>
          {props.result._hits &&
            props.result._hits.map((hit, key) => (
              <div key={key} className="hover:bg-rpBrand1grey-50 w-full p-4">
                <div
                  className="mb-1 text-base"
                  dangerouslySetInnerHTML={{ __html: hit.preview }}
                ></div>
              </div>
            ))}
        </li>
      </Link>
    </ul>
  );
};
