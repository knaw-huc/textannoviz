import { Link } from "react-router-dom";
import { VanGoghSearchResultsBody } from "../../model/Search";

import _ from "lodash";
import { QUERY } from "../../components/Search/SearchUrlParams.ts";
import { SearchItemProps } from "../../model/SearchItemProps.ts";
import { encodeObject } from "../../utils/UrlParamUtils.ts";
import { firstLetterToUppercase } from "../../utils/firstLetterToUppercase.ts";

export const SearchItem = (
  props: SearchItemProps<VanGoghSearchResultsBody>,
) => {
  const dateOptions: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  const formattedDate = new Date(props.result.period).toLocaleDateString(
    "en-GB",
    dateOptions,
  );

  const searchItemTitle = `Letter from ${props.result.sender} to ${props.result.correspondent}. ${props.result.location}, ${formattedDate}`;

  const queryUrlParam = encodeObject(_.pick(props.query, "fullText"));
  return (
    <ul className="border-brand1Grey-200 mb-4 border-b">
      <li className="mb-3 text-base">
        <span className="font-semibold">
          {firstLetterToUppercase(props.result.viewType)}
        </span>
      </li>
      <Link
        to={`/detail/${props.result.letterId}?${QUERY}=${queryUrlParam}`}
        className="hover:text-brand1-600 active:text-brand1-700 text-inherit no-underline"
      >
        <li className="divide-brand1Grey-100 border-brand1Grey-50 hover:divide-brand1Grey-200 hover:border-brand1Grey-200 mb-6 w-full cursor-pointer divide-y divide-solid rounded border bg-white shadow-sm transition hover:bg-white">
          <div className="p-4 font-semibold">{searchItemTitle}</div>
          {props.result._hits?.text.map((hit, index) => (
            <div key={index} className="hover:bg-brand1Grey-50 w-full p-4">
              <div
                className="mb-1 font-serif text-base"
                dangerouslySetInnerHTML={{ __html: hit }}
              />
            </div>
          ))}
        </li>
      </Link>
    </ul>
  );
};
