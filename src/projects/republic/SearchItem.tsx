import { Link } from "react-router-dom";
import { Labels } from "../../model/Labels.ts";
import { RepublicSearchResultBody } from "../../model/Search.ts";
import { SearchItemProps } from "../../model/SearchItemProps.ts";
import {
  translateProjectSelector,
  translateSelector,
  useProjectStore,
} from "../../stores/project";
import { useDetailNavigation } from "../../components/Detail/useDetailNavigation.tsx";

export const SearchItem = (
  props: SearchItemProps<RepublicSearchResultBody>,
) => {
  const translate = useProjectStore(translateSelector);
  const translateProject = useProjectStore(translateProjectSelector);
  const { createDetailUrl } = useDetailNavigation();

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
      <li className="mb-3 text-base" tabIndex={0}>
        {translateProject(props.result.sessionWeekday)}{" "}
        <span className="font-semibold">
          {props.result.sessionDay}{" "}
          {translate(monthNumberToString[props.result.sessionMonth])}{" "}
          {props.result.sessionYear}
        </span>
      </li>
      <li className="divide-brand1Grey-100 border-brand1Grey-50 hover:divide-brand1Grey-200 hover:border-brand1Grey-200 mb-6 w-full divide-y divide-solid rounded border bg-white shadow-sm transition hover:bg-white">
        <Link
          to={createDetailUrl(props.result._id, {
            highlight: props.query.fullText,
          })}
          className="hover:text-brand1-700 cursor-pointer text-inherit no-underline transition"
        >
          <div className="flex flex-col p-4">
            <div className="font-semibold">
              {translateProject(props.result.bodyType)}
            </div>
            <div className="text-brand1Grey-500 italic">
              {props.result.resolutionType}, {props.result.textType}
            </div>
          </div>
        </Link>

        {props.result._hits?.text.map((hit, key) => (
          <div key={key} className="w-full p-4">
            <div
              className="mb-1 font-serif text-base"
              dangerouslySetInnerHTML={{ __html: hit }}
            ></div>
          </div>
        ))}
      </li>
    </ul>
  );
};
