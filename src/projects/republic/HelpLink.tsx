import { projectConfigSelector, useProjectStore } from "../../stores/project";

export function HelpLink() {
  const interfaceLang = useProjectStore(projectConfigSelector).selectedLanguage;

  return (
    <div className="mr-4 flex grow flex-row items-center justify-end gap-2">
      <a
        rel="noreferrer"
        target="_blank"
        href={
          interfaceLang === "nl"
            ? "https://goetgevonden.nl/help/gebruik-van-de-applicatie"
            : "https://goetgevonden.nl/en/using-the-application/"
        }
        className="hover:text-brand1-100 text-inherit no-underline hover:underline"
      >
        Help
      </a>
    </div>
  );
}
