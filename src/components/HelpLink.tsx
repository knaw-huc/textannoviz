export function HelpLink() {
  return (
    <div className="mr-4 flex grow flex-row items-center justify-end gap-2">
      <a
        title="Help"
        rel="noreferrer"
        href={window.location.pathname === "/help" ? "/" : "/help"}
        className="hover:text-brand1-100 text-inherit no-underline hover:underline"
      >
        {window.location.pathname === "/help" ? "Search" : "Help"}
      </a>
    </div>
  );
}
