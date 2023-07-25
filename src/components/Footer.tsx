import { Link } from "react-router-dom";
import { AnnotationButtons } from "./Annotations/AnnotationButtons";

type FooterProps = {
  nextOrPrevButtonClicked: (clicked: boolean) => boolean;
};

export const Footer = (props: FooterProps) => {
  return (
    <div className="fixed bottom-0 w-full border-t border-brand1Grey-100 bg-white text-sm text-neutral-500 drop-shadow-top">
      <div className="mx-auto flex max-w-[1700px] flex-col justify-between lg:flex-row">
        <div className="flex w-full flex-row justify-start gap-8 lg:w-2/5">
          <button className="flex flex-row items-center gap-1 py-1 pl-10 text-neutral-500">
            <Link to="/search">Back to search</Link>
          </button>
          <button className="flex flex-row items-center gap-1 text-neutral-500">
            Show results
          </button>
          <button className="flex flex-row items-center gap-1 text-neutral-500">
            Hide facsimile
          </button>
        </div>
        <div className="flex w-full flex-row justify-between lg:w-2/5">
          <AnnotationButtons
            nextOrPrevButtonClicked={props.nextOrPrevButtonClicked}
          />
        </div>
        <div className="flex w-full flex-row justify-end lg:w-1/5">
          <button className="flex flex-row items-center gap-1 py-1 pr-6 text-neutral-500">
            Hide info
          </button>
        </div>
      </div>
    </div>
  );
};
