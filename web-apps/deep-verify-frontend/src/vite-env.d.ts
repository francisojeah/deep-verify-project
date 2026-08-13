/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  /** NestJS API: accounts and detection history. */
  readonly VITE_API_BASE_URL: string;
  /** Detection service: the deployed Hugging Face Space. */
  readonly VITE_ML_SERVICE_URL: string;
  readonly VITE_MODEL_CARD_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
