export const isDev = import.meta.env.DEV;
export const isProd = import.meta.env.PROD;

export const config = {
  apiUrl: isDev ? "http://localhost:3000" : "https://erikvullings.github.io/dasdf-toolset/",
  base: isDev ? "/" : "/dasf-toolset/",
  defaultLang: "en",
  languages: ["en", "nl", "de", "fr"]
};
