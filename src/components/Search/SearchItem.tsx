import { Link } from "react-router-dom";
import { Labels } from "../../model/Labels.ts";
import {
  GlobaliseSearchResultsBody,
  MondriaanSearchResultsBody,
  RepublicSearchResultBody,
  TranslatinSearchResultsBody,
} from "../../model/Search";
import {
  translateProjectSelector,
  translateSelector,
  useProjectStore,
} from "../../stores/project";

interface SearchItemProps {
  result:
    | RepublicSearchResultBody
    | TranslatinSearchResultsBody
    | MondriaanSearchResultsBody
    | GlobaliseSearchResultsBody;
}

export const SearchItem = (props: SearchItemProps) => {
  const translate = useProjectStore(translateSelector);
  const translateProject = useProjectStore(translateProjectSelector);

  const monthNumberToString: Record<number, keyof Labels> = {
    1: "JANUARY",
    2: "FEBRUARY",
    3: "MARCH",
    4: "APRIL",
    5: "MAY",
    6: "JUNE",
    7: "JULY",
    8: "AUGUST",
    9: "SEPTEMBER",
    10: "OCTOBER",
    11: "NOVEMBER",
    12: "DECEMBER",
  };

  return (
    <ul className="border-brand1Grey-200 mb-4 border-b">
      <li className="mb-3 text-base">
        {translateProject(
          (props.result as RepublicSearchResultBody).sessionWeekday,
        )}{" "}
        <strong className="font-semibold">
          {(props.result as RepublicSearchResultBody).sessionDay}{" "}
          {translate(
            monthNumberToString[
              (props.result as RepublicSearchResultBody).sessionMonth
            ],
          )}{" "}
          {(props.result as RepublicSearchResultBody).sessionYear}
        </strong>
      </li>
      <Link
        to={`/detail/${(props.result as RepublicSearchResultBody)._id}`}
        className="hover:text-brand1-600 active:text-brand1-700 text-inherit no-underline"
      >
        <li className="divide-rpBrand1grey-100 border-rpBrand1grey-50 hover:divide-rpBrand1grey-200 hover:border-rpBrand1grey-200 mb-6 w-full cursor-pointer divide-y divide-solid rounded border bg-white shadow-sm transition hover:bg-white">
          <div className="p-4 font-semibold">
            {translateProject(
              (props.result as RepublicSearchResultBody).bodyType,
            ) ?? (props.result as RepublicSearchResultBody).document}
          </div>
          {(props.result as RepublicSearchResultBody)._hits?.map((hit, key) => (
            <div key={key} className="hover:bg-rpBrand1grey-50 w-full p-4">
              <div
                className="mb-1 font-serif text-base"
                dangerouslySetInnerHTML={{ __html: hit.preview }}
              ></div>
            </div>
          ))}
        </li>
      </Link>
    </ul>
  );
};
