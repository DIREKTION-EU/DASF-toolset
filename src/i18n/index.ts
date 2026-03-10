import en from "./locales/en.json";
import nl from "./locales/nl.json";
import de from "./locales/de.json";
import fr from "./locales/fr.json";
import { config } from "../utils/config";

interface Translations {
  [key: string]: string | Translations;
}

interface TranslateInstance {
  load: (lang: string, translations: Translations) => void;
  setLang: (lang: string) => void;
  getLang: () => string;
  translate: (key: string) => string;
}

class Translate implements TranslateInstance {
  private currentLang: string = config.defaultLang;
  private languages: Record<string, Translations> = {};
  private localStorageKey: string = "dasf-lang";

  constructor() {
    this.load("en", en);
    this.load("nl", nl);
    this.load("de", de);
    this.load("fr", fr);

    // Set language from localStorage or URL query param
    const savedLang = localStorage.getItem(this.localStorageKey);
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get("lang");

    if (savedLang && config.languages.includes(savedLang)) {
      this.currentLang = savedLang;
    } else if (urlLang && config.languages.includes(urlLang)) {
      this.currentLang = urlLang;
      localStorage.setItem(this.localStorageKey, urlLang);
    } else {
      // Try browser language detection
      const browserLang = navigator.language.slice(0, 2);
      if (config.languages.includes(browserLang)) {
        this.currentLang = browserLang;
        localStorage.setItem(this.localStorageKey, browserLang);
      }
    }
  }

  load(lang: string, translations: Translations): void {
    this.languages[lang] = translations;
  }

  setLang(lang: string): void {
    if (config.languages.includes(lang)) {
      this.currentLang = lang;
      localStorage.setItem(this.localStorageKey, lang);
    }
  }

  getLang(): string {
    return this.currentLang;
  }

  translate(key: string): string {
    const keys = key.split(".");
    let value: any = this.languages[this.currentLang];

    for (const k of keys) {
      if (value && typeof value === "object") {
        value = value[k];
      } else {
        // Fallback to English
        value = en;
        for (const ek of keys) {
          if (value && typeof value === "object") {
            value = value[ek];
          } else {
            return key;
          }
        }
        return typeof value === "string" ? value : key;
      }
    }

    return typeof value === "string" ? value : key;
  }
}

const translate = new Translate();

// Helper function for components
const t = (key: string): string => translate.translate(key);

// Export for use in other modules
export { translate, t, Translate };
export type { TranslateInstance };
