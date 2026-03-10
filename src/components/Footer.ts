import m from "mithril";

interface Attrs {}

interface State {}

const Footer: m.Component<Attrs, State> = {
  view: (vnode) => {
    return m(
      "footer",
      { class: "footer" },
      m(
        "div",
        { class: "footer-copyright" },
        m(
          "div",
          { class: "container center" },
          "Copyright 2026 - DASF Toolset"
        )
      )
    );
  },
};

export default Footer;
