import { Link } from "react-router-dom";
import { IsraelsSearchResultsBody } from "../../model/Search.ts";

import _ from "lodash";
import { QUERY } from "../../components/Search/SearchUrlParams.ts";
import { SearchItemProps } from "../../model/SearchItemProps.ts";
import { encodeObject } from "../../utils/UrlParamUtils.ts";
import {
  translateProjectSelector,
  useProjectStore,
} from "../../stores/project.ts";
// import { firstLetterToUppercase } from "../../utils/firstLetterToUppercase.ts";

export const SearchItem = (
  props: SearchItemProps<IsraelsSearchResultsBody>,
) => {
  const translateProject = useProjectStore(translateProjectSelector);
  const dateOptions: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  const formattedDate = props.result.period
    ? new Date(props.result.period).toLocaleDateString("en-GB", dateOptions)
    : "No date";

  const searchItemTitle = `Letter from ${props.result.sender} to ${props.result.correspondent}. ${props.result.location}, ${formattedDate}`;

  const queryUrlParam = encodeObject(_.pick(props.query, "fullText"));
  return (
    <ul className="border-brand1Grey-200 mb-4 border-b">
      <li className="divide-brand1Grey-100 border-brand1Grey-50 hover:divide-brand1Grey-200 hover:border-brand1Grey-200 mb-6 w-full divide-y divide-solid rounded border bg-white shadow-sm transition hover:bg-white">
        <Link
          to={`/detail/${props.result._id}?${QUERY}=${queryUrlParam}`}
          className="hover:text-brand1-600 active:text-brand1-700 cursor-pointer text-inherit no-underline"
        >
          <div className="p-4 font-semibold">{searchItemTitle}</div>
          {/* {props.result._hits?.text.map((hit, index) => (
            <div key={index} className="hover:bg-brand1Grey-50 w-full p-4">
              <div
                className="mb-1 font-serif text-base"
                dangerouslySetInnerHTML={{ __html: hit }}
              />
            </div>
          ))} */}
        </Link>
        {props.result._hits
          ? Object.entries(props.result._hits).map(([viewType, hit]) => {
              return (
                <li key={viewType} className="w-full p-4">
                  <div className="mb-1 font-semibold">
                    {translateProject(viewType)}:
                  </div>
                  <div
                    className="mb-1 font-serif text-base"
                    dangerouslySetInnerHTML={{ __html: hit }}
                  ></div>
                </li>
              );
            })
          : null}
      </li>
    </ul>
  );
};
