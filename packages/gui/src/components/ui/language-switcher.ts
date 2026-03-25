import m, { type Attributes, type FactoryComponent } from "mithril";
import { Select } from "mithril-materialized";
import { type Languages, t } from "../../services";

export interface LanguageSwitcherAttrs extends Attributes {
  currentLanguage: Languages;
  onLanguageChange: (language: Languages) => void;
}

export const LanguageSwitcher: FactoryComponent<LanguageSwitcherAttrs> = () => {
  return {
    view: ({ attrs: { currentLanguage, onLanguageChange, className } }) => {
      return m(Select<Languages>, {
        iconName: "language",
        initialValue: currentLanguage,
        className,
        options: [
          { id: "en", label: "English" },
          { id: "nl", label: "Nederlands" },
          { id: "de", label: "Deutsch" },
          { id: "fr", label: "Français" },
          { id: "es", label: "Español" },
          { id: "it", label: "Italiano" },
          { id: "pl", label: "Polski" },
          { id: "pt", label: "Português" },
          { id: "sv", label: "Svenska" },
        ],
        label: t("LANGUAGE"),
        onchange: (language) => onLanguageChange(language[0]),
      });
    },
  };
};
