import logoHuygens from "../../assets/logo-huygens.png";
import logoVGM from "../../assets/logo-vgm.png";

export const SearchInfoPage = () => {
  return (
    <div className="border-brand1Grey-100 bg-brand2-500 -mx-10 mb-20 flex -translate-y-16 items-center justify-center border-b px-10 py-24 pb-8 2xl:min-h-[75vh]">
      <div className="mx-auto w-full max-w-4xl ">
        <h1 className="">Isaac Israëls’s letters to Jo van Gogh-Bonger </h1>

        <h2>Edited by Hans Luijten</h2>

        <div className="flex max-w-3xl flex-col gap-6">
          <p className="">
            This edition includes the more than 100 letters the artist Isaac
            Israëls (1865-1934) wrote to Jo van Gogh-Bonger (1862-1925). Jo was
            married to Vincent van Gogh’s brother Theo and, following both
            brothers’ demise, took responsibility for preserving their legacy.
          </p>
          <p>
            Israëls writes with great candour and verve about art, literature,
            music, love and friendship. He had a keen interest in Jo and her
            tribulations and enjoyed their time together. But he was also
            fascinated by Vincent’s work, as he frequently expresses in his
            letters.
          </p>
        </div>

        <div className="my-8 flex flex-col gap-8 md:flex-row md:items-end">
          <div>
            <img src={logoVGM} className="h-24" alt="logo" />
          </div>
          <div>
            <img src={logoHuygens} className="h-16" alt="logo" />
          </div>
        </div>
      </div>
    </div>
  );
};
