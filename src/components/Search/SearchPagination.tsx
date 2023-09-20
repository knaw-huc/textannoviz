import { Button } from "react-aria-components";
import { SearchResult } from "../../model/Search";

type SearchPaginationProps = {
  prevPageClickHandler: () => void;
  nextPageClickHandler: () => void;
  pageNumber: number;
  searchResults: SearchResult;
  elasticSize: number;
};

export const SearchPagination = (props: SearchPaginationProps) => {
  return (
    <nav aria-label="Pagination" className="my-6">
      <ul className="list-style-none flex justify-center gap-1">
        <li>
          <Button
            className={({ isPressed }) =>
              isPressed
                ? "bg-brand1Grey-300 text-brand1Grey-800 dark:text-brand1Grey-400 relative block rounded px-3 py-1.5 outline-none"
                : "text-brand1Grey-800 dark:text-brand1Grey-400 hover:bg-brand1Grey-100 relative block rounded bg-transparent px-3 py-1.5 outline-none transition-all duration-300"
            }
            onPress={props.prevPageClickHandler}
          >
            Prev
          </Button>
        </li>
        <li>
          <div className="text-brand1Grey-800 relative block bg-transparent px-3 py-1.5">
            {`${props.pageNumber} of ${Math.ceil(
              props.searchResults!.total.value / props.elasticSize,
            )}`}
          </div>
        </li>
        <li>
          <Button
            className={({ isPressed }) =>
              isPressed
                ? "bg-brand1Grey-300 text-brand1Grey-800 dark:text-brand1Grey-400 relative block rounded px-3 py-1.5 outline-none"
                : "text-brand1Grey-800 dark:text-brand1Grey-400 hover:bg-brand1Grey-100 relative block rounded bg-transparent px-3 py-1.5 outline-none transition-all duration-300"
            }
            onPress={props.nextPageClickHandler}
          >
            Next
          </Button>
        </li>
      </ul>

      {/* <select onChange={jumpToPageHandler} value={pageNumber}>
              {Array.from(
                {
                  length: Math.ceil(searchResults.total.value / elasticSize),
                },
                (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ),
              )}
            </select> */}
    </nav>
  );
};
