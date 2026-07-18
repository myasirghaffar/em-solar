export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      /** Kept for docs/compat; client always uses same-origin `/api`. */
      NEXT_PUBLIC_API_URL?: string;
      NEXT_PUBLIC_APP_URL?: string;
      NEXT_PUBLIC_EM_TOOLS_URL?: string;
    }
  }
}
