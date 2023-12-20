import { Link } from "react-router-dom";
import { GlobaliseSearchResultsBody } from "../../model/Search";

type SearchItemProps = {
  result: GlobaliseSearchResultsBody;
};

export const SearchItem = (props: SearchItemProps) => {
  return (
    <ul className="border-brand1Grey-200 mb-4 border-b">
      <Link
        to={`/detail/${props.result._id}`}
        className="hover:text-brand1-600 active:text-brand1-700 text-inherit no-underline"
      >
        <li className="divide-brand1Grey-100 border-brand1Grey-50 hover:divide-brand1Grey-200 hover:border-brand1Grey-200 mb-6 w-full cursor-pointer divide-y divide-solid rounded border bg-white shadow-sm transition hover:bg-white">
          <div className="p-4 font-semibold">{props.result.document}</div>
          {props.result._hits?.map((hit, index) => (
            <div key={index} className="hover:bg-brand1Grey-50 w-full p-4">
              <div
                className="mb-1 font-serif text-base"
                dangerouslySetInnerHTML={{ __html: hit.preview }}
              />
            </div>
          ))}
        </li>
      </Link>
    </ul>
  );
};