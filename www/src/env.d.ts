//

interface ImportMetaEnv {
  readonly VITE_STRAPI_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
