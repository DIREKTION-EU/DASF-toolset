import m from "mithril";

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
              m("div", { class: "card-content" }, m("span", { class: "card-title" }, "DASF Toolset")),
              m("div", { class: "card-body" }, m("p", {}, "Disaster Assessment and Solution Framework toolset for safety professionals to collaboratively assess disaster management capabilities, identify gaps, and build roadmaps for research and solution adoption through structured facilitator-led sessions."))
            )
          )
        )
      )
    );
  },
};

export default Home;
