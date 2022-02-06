/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SYMBOL: string;
  readonly VITE_NATS_USER: string;
  readonly VITE_NATS_PASS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
