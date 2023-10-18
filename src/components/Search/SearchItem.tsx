import { Link } from "react-router-dom";
import { SearchResultBody } from "../../model/Search";
import {useProjectStore} from "../../stores/project";

interface SearchItemProps {
  result: SearchResultBody;
}

export const SearchItem = (props: SearchItemProps) => {
  const projectConfig = useProjectStore((state) => state.projectConfig);

  const monthNumberToString: Record<number, string> = {
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
        {(projectConfig &&
          projectConfig.facetsTranslation &&
          projectConfig.facetsTranslation[props.result.sessionWeekday]) ??
          props.result.sessionWeekday}{" "}
        <strong className="font-semibold">
          {props.result.sessionDay}{" "}
          {monthNumberToString[props.result.sessionMonth]}{" "}
          {props.result.sessionYear}
        </strong>
      </li>
      <Link
        to={`/detail/${props.result._id}`}
        className="hover:text-brand1-600 active:text-brand1-700 text-inherit no-underline"
      >
        <li className="divide-rpBrand1grey-100 border-rpBrand1grey-50 hover:divide-rpBrand1grey-200 hover:border-rpBrand1grey-200 mb-6 w-full cursor-pointer divide-y divide-solid rounded border bg-white shadow-sm transition hover:bg-white">
          <div className="p-4 font-semibold">
            {(projectConfig &&
              projectConfig.facetsTranslation &&
              projectConfig.facetsTranslation[props.result.bodyType]) ??
              props.result.document}
          </div>
          {props.result._hits?.map((hit, key) => (
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
