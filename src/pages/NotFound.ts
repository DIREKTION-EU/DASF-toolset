import m from "mithril";

interface Attrs {}

interface State {}

const NotFound: m.Component<Attrs, State> = {
  view: (vnode) => {
    return m(
      "div",
      { class: "not-found" },
      m(
        "div",
        { class: "container" },
        m(
          "div",
          { class: "row" },
          m(
            "div",
            { class: "col s12 m8 offset-m2 l6 offset-l3" },
            m(
              "div",
              { class: "card" },
              m("div", { class: "card-content" }, m("span", { class: "card-title" }, "404 - Page Not Found")),
              m("div", { class: "card-body" }, m("p", {}, "The page you are looking for does not exist.")),
              m(
                "div",
                { class: "card-action" },
                m("a", { href: "/", class: "btn waves-effect" }, m.routeLink("/", "Go Home"))
              )
            )
          )
        )
      )
    );
  },
};

export default NotFound;
