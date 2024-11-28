export function HelpLink() {
  return (
    <div className="mr-4 flex grow flex-row items-center justify-end gap-2">
      <a
        rel="noreferrer"
        target="_blank"
        // TODO: verify url:
        href="https://goetgevonden.nl/index.php/help/gebruik-van-de-applicatie"
        className="hover:text-brand1-100 text-inherit no-underline hover:underline"
      >
        Help
      </a>
    </div>
  );
}
