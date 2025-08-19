import logoHuygens from "../../assets/logo-huygens.png";
import logoVGM from "../../assets/logo-vgm.png";
import {
  translateProjectSelector,
  useProjectStore,
} from "../../stores/project";

export const SearchInfoPage = () => {
  const translateProject = useProjectStore(translateProjectSelector);

  return (
    <div className="border-brand1Grey-100 -mx-10 -mb-10 flex -translate-y-16 border-b bg-[#FFCE01] px-10 py-8">
      <div className="mx-auto w-full max-w-4xl ">
        <h1>{translateProject("INFO_TITLE")}</h1>

        <h2>{translateProject("EDITED_BY")}</h2>

        <div className="flex max-w-3xl flex-col gap-6">
          <p>{translateProject("P1")}</p>
          <p>{translateProject("P2")}</p>
        </div>

        <div className="my-8 flex flex-col gap-8 md:flex-row md:items-end">
          <div>
            <img src={logoVGM} className="h-20" alt="logo" />
          </div>
          <div>
            <img src={logoHuygens} className="h-14" alt="logo" />
          </div>
        </div>
      </div>
    </div>
  );
};
