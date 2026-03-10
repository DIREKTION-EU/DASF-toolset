import m from "mithril";
import { t } from "../i18n";
import LanguageSwitcher from "./LanguageSwitcher";

interface Attrs {
  title?: string;
}

interface State {}

const Header: m.Component<Attrs, State> = {
  view: (vnode) => {
    return m(
      "header",
      { class: "header" },
      m(
        "div",
        { class: "nav-wrapper" },
        m(
          "a",
          { href: "#!", class: "brand-logo center" },
          vnode.attrs.title || t("home.title")
        ),
        m(
          "nav",
          {},
          m(
            "ul",
            { class: "right hide-on-med-and-down" },
            m("li", {}, m("a", { href: "/", class: "waves-effect" }, t("header.nav.home"))),
            m("li", {}, m(() => m(LanguageSwitcher)))
          )
        )
      )
    );
  }
};

export default Header;
