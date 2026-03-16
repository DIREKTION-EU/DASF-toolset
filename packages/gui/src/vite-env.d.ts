/// <reference types="vite/client" />

// Extend Vite's ImportMetaEnv with our custom environment variables
interface ImportMetaEnv {
  readonly APP_TITLE: string;
  readonly APP_TITLE_SHORT: string;
  readonly APP_DESC: string;
  readonly APP_PORT: string;
  readonly SERVER: string;
  readonly NODE_ENV: string;
  readonly PUBLIC_URL: string;
}
