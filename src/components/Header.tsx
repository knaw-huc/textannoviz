import logoUrl from "../assets/G-1.png";

export const Header = () => {
  return (
    <header className="border-brand1-200 text-brand1-700 border-b">
      <div className="mx-auto w-full px-6">
        <div className="flex flex-row items-center justify-start">
          <div className="bg-brand1-100 text-brand1-800 -mx-6 -my-3 flex flex-row items-center justify-start gap-3 py-3 pr-3">
            <div className="bg-brand2-200 flex h-12 w-12 items-center justify-center">
              <a
                title="Homepage"
                rel="noreferrer"
                target="_blank"
                href="https://globalise.huygens.knaw.nl"
              >
                <img src={logoUrl} className="h-7 w-7" />
              </a>
            </div>
            <span className="">
              <a
                title="Homepage"
                rel="noreferrer"
                href="/"
                className="hover:text-brand1-900 text-inherit no-underline hover:underline"
              >
                GLOBALISE Transcriptions Viewer
              </a>
              {" | "}
              <a
                title="About"
                rel="noreferrer"
                href={window.location.pathname === "/about" ? "/" : "/about"}
                className="hover:text-brand1-900 text-inherit no-underline hover:underline"
              >
                {window.location.pathname === "/about" ? "Search" : "About"}
              </a>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
