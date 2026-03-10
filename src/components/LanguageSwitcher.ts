import m from "mithril";
import { translate, t } from "../i18n";
import { config } from "../utils/config";

interface Attrs {}

interface State {}

const LanguageSwitcher: m.Component<Attrs, State> = {
  view: (vnode) => {
    return m(
      "div",
      { class: "language-switcher" },
      m(
        "label",
        { class: "label" },
        t("languageSwitcher.label")
      ),
      m(
        "div",
        { class: "input-field" },
        m(
          "select",
          {
            value: translate.getLang(),
            onchange: (e: Event) => {
              const target = e.target as HTMLSelectElement;
              translate.setLang(target.value);
            }
          },
          config.languages.map((lang) =>
            m("option", { value: lang, key: lang }, lang.toUpperCase())
          )
        )
      )
    );
  }
};

export default LanguageSwitcher;
