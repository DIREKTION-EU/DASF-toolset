import m from "mithril";

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
          vnode.attrs.title || "DASF Toolset"
        ),
        m(
          "nav",
          {},
          m(
            "ul",
            { class: "right hide-on-med-and-down" },
            m("li", {}, m("a", { href: "/", class: "waves-effect" }, "Home"))
          )
        )
      )
    );
  },
};

export default Header;
