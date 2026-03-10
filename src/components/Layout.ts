import m from "mithril";
import mithrilMaterialized from "mithril-materialized";

const { m, layout, header, main, footer } = mithrilMaterialized;

interface Attrs {
  children: m.Children;
}

interface State {}

const Layout: m.Component<Attrs, State> = {
  view: (vnode) => {
    return m(
      "div",
      { class: "wrapper" },
      m(
        layout,
        {},
        m(
          header,
          { title: "DASF Toolset" },
          m("div", { class: "brand-logo center" }, "DASF Toolset")
        ),
        m(
          main,
          {},
          vnode.attrs.children
        ),
        m(footer, {}, m("p", { class: "center" }, "Copyright 2026 - DASF Toolset"))
      )
    );
  },
};

export default Layout;
