import m from "mithril";
import { t } from "../i18n";

interface Attrs {}

interface State {}

const Home: m.Component<Attrs, State> = {
  view: (vnode) => {
    return m(
      "div",
      { class: "home" },
      m(
        "div",
        { class: "container" },
        m(
          "div",
          { class: "row" },
          m(
            "div",
            { class: "col s12 m6 offset-m3 l4 offset-l4" },
            m(
              "div",
              { class: "card" },
              m("div", { class: "card-content" }, m("span", { class: "card-title" }, t("home.title"))),
              m("div", { class: "card-body" }, m("p", {}, t("home.description")))
            )
          )
        )
      )
    );
  }
};

export default Home;
