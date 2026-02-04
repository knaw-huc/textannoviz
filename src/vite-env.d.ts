/// <reference types="vite/client" />

interface ViteTypeOptions {
  // By adding this line, you can make the type of ImportMetaEnv strict
  // to disallow unknown keys.
  // strictImportMetaEnv: unknown
}

interface ImportMetaEnv {
  readonly VITE_TITLE: string;
  readonly VITE_PROJECT: string;
  readonly VITE_ROUTER_BASENAME: string;
  readonly VITE_ISRAELS_PERSONS_URL: string;
  readonly VITE_ISRAELS_ARTWORKS_URL: string;
  readonly VITE_ISRAELS_BIBL_EN_URL: string;
  readonly VITE_ISRAELS_BIBL_NL_URL: string;

  readonly VITE_VANGOGH_PERSONS_URL: string;
  readonly VITE_VANGOGH_ARTWORKS_URL: string;
  readonly VITE_VANGOGH_BIBL_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
