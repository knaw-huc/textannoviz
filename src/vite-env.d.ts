/// <reference types="vite/client" />

interface ViteTypeOptions {
  // By adding this line, you can make the type of ImportMetaEnv strict
  // to disallow unknown keys.
  strictImportMetaEnv: unknown;
}

interface ImportMetaEnv {
  readonly VITE_TITLE: string;
  readonly VITE_PROJECT: string;
  readonly VITE_ROUTER_BASENAME: string;
  readonly VITE_BROCCOLI_PORT_VANGOGH: string;
  readonly VITE_BROCCOLI_PORT_MONDRIAN: string;
  readonly VITE_NGINX_PORT_VANGOGH: string;
  readonly VITE_NGINX_PORT_MONDRIAN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
