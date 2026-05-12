import { Link } from "react-router";
import _ from "lodash";
import { QUERY } from "../../components/Search/SearchUrlParams.ts";
import { SearchItemProps } from "../../model/SearchItemProps.ts";
import { encodeObject } from "../../utils/url/UrlParamUtils.ts";
import { VanGoghSearchResultsBody } from "../../model/Search.ts";
import { useTranslateProject } from "../../stores/project.ts";

export const SearchItem = (
  props: SearchItemProps<VanGoghSearchResultsBody>,
) => {
  const translateProject = useTranslateProject();
  const searchItemTitle = props.result.title;

  const letterNum = props.result.file;

  const queryUrlParam = encodeObject(_.pick(props.query, "fullText"));
  return (
    <li className=" border-brand1Grey-50 hover:border-brand1-600 mb-6 w-full rounded border bg-white shadow-sm transition hover:bg-white">
      <Link
        to={`/detail/${props.result._id}?${QUERY}=${queryUrlParam}`}
        className="hover:text-brand1-600 active:text-brand1-700 cursor-pointer text-inherit no-underline"
      >
        <div className="flex flex-col p-4">
          <div className="font-semibold">{searchItemTitle}</div>
          {props.result.type === "letter" ? (
            <div className="italic text-neutral-600">
              {translateProject("LET_NUM")}: {letterNum}
            </div>
          ) : null}
        </div>
      </Link>
      {props.result._hits
        ? Object.entries(props.result._hits).map(([viewType, hits]) => {
            return (
              <div key={viewType} className="w-full p-4">
                <div className="mb-1 font-semibold">
                  {translateProject(viewType)}:
                </div>
                <ul className="ml-4 list-disc">
                  {hits.map((hit, index) => (
                    <li
                      className="mb-1 ml-4 list-disc font-serif text-base"
                      dangerouslySetInnerHTML={{ __html: hit }}
                      key={index}
                    />
                  ))}
                </ul>
              </div>
            );
          })
        : null}
    </li>
  );
};
