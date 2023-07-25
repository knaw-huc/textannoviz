type HeaderProps = {
  project: string;
};

export const Header = (props: HeaderProps) => {
  return (
    <header className="border-b border-brand1-200 text-brand1-700">
      <div className="mx-auto w-full px-6">
        <div className="flex flex-row items-center justify-start">
          <div className="-mx-6 -my-3 flex flex-row items-center justify-start gap-3 bg-brand1-100 py-3 pl-3 text-brand-800">
            <span className="uppercase">{props.project}</span>
            <div className="flex h-12 w-12 items-center justify-center bg-brand2-300">
              <img
                src="/src/assets/logo-republic-temp.png"
                alt=""
                className="h-7 w-7"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
