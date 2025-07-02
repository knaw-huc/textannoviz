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
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
