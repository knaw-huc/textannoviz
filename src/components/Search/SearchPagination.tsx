import React from "react";
import { Button } from "react-aria-components";
import { SearchResult } from "../../model/Search";
import { translateSelector, useProjectStore } from "../../stores/project.ts";

type SearchPaginationProps = {
  prevPageClickHandler: () => void;
  nextPageClickHandler: () => void;
  jumpToPage: (page: number) => void;
  pageNumber: number;
  searchResult: SearchResult;
  elasticSize: number;
};

export const SearchPagination = (props: SearchPaginationProps) => {
  const translate = useProjectStore(translateSelector);
  const [pageNumber, setPageNumber] = React.useState(props.pageNumber);

  function pageNumberInputChangeHandler(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    setPageNumber(parseInt(event.target.value));
  }

  function pageNumberInputKeyUpHandler(
    event: React.KeyboardEvent<HTMLInputElement>,
  ) {
    if (event.key === "Enter") {
      if (pageNumber === 0) {
        setPageNumber(1);
        return;
      }
      props.jumpToPage(pageNumber);
    }
  }

  function renderPageNumberInput() {
    return (
      //BUG: remove contents input > you get "NaN"
      <input
        className="border-brand1Grey-700 mr-2 w-16 rounded border bg-white px-2 py-1 text-sm"
        value={pageNumber}
        onChange={(event) => pageNumberInputChangeHandler(event)}
        onKeyUp={(event) => pageNumberInputKeyUpHandler(event)}
      />
    );
  }

  function prevButtonClickedHandler() {
    if (props.pageNumber === 1) return;
    setPageNumber((prev) => prev - 1);
    props.prevPageClickHandler();
  }

  function nextButtonClickHandler() {
    setPageNumber((prev) => prev + 1);
    props.nextPageClickHandler();
  }

  return (
    <nav aria-label="Pagination">
      <ul className="list-style-none flex items-center justify-center gap-1">
        <li>
          <Button
            className={({ isPressed }) =>
              isPressed
                ? "bg-brand1Grey-300 text-brand1Grey-800 dark:text-brand1Grey-400 relative block rounded px-3 py-1.5 outline-none"
                : "text-brand1Grey-800 dark:text-brand1Grey-400 hover:bg-brand1Grey-100 relative block rounded bg-transparent px-3 py-1.5 outline-none transition-all duration-300"
            }
            onPress={prevButtonClickedHandler}
          >
            {translate("PREV")}
          </Button>
        </li>
        <li>
          <div className="text-brand1Grey-800 relative block bg-transparent px-3 py-1.5">
            {renderPageNumberInput()}
            {`${translate("FROM").toLowerCase()} ${Math.ceil(
              props.searchResult!.total.value / props.elasticSize,
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
            onPress={nextButtonClickHandler}
          >
            {translate("NEXT")}
          </Button>
        </li>
      </ul>
    </nav>
  );
};
