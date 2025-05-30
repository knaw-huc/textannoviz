import { Link } from "react-router-dom";
import { SurianoSearchResultsBody } from "../../model/Search.ts";
import { Summary } from "./Summary";
import { SearchItemProps } from "../../model/SearchItemProps.ts";
import { useDetailNavigation } from "../../components/Detail/useDetailNavigation.tsx";

export const SearchItem = (
  props: SearchItemProps<SurianoSearchResultsBody>,
) => {
  const dateOptions: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  const formattedDate = new Date(props.result.date).toLocaleDateString(
    "en-GB",
    dateOptions,
  );

  const searchItemTitle = `${props.result.sender} to ${props.result.recipient}, ${formattedDate}`;
  const { createDetailUrl } = useDetailNavigation();

  return (
    <ul className="border-brand1Grey-200 mb-4 border-b">
      <Link
        to={createDetailUrl(props.result._id)}
        className="hover:text-brand1-600 active:text-brand1-700 text-inherit no-underline"
      >
        <li className="divide-brand1Grey-100 border-brand1Grey-50 hover:divide-brand1Grey-200 hover:border-brand1Grey-200 mb-6 w-full cursor-pointer divide-y divide-solid rounded border bg-white shadow-sm transition hover:bg-white">
          <div className="flex flex-col gap-1 p-4">
            <p className="font-semibold">{searchItemTitle}</p>
            {props.result.summary.length > 0 ? (
              <Summary
                summary={props.result.summary}
                summaryHits={props.result._hits?.summary}
              />
            ) : null}
          </div>
          {props.result._hits?.text?.map((hit, index) => (
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
