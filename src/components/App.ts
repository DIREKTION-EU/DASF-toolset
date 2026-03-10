import m from "mithril";
import Layout from "./Layout";

interface Attrs {}

interface State {}

const App: m.Component<Attrs, State> = {
  view: (vnode) => {
    return m(Layout, { children: m("div", { id: "router-outlet" }, m.route.route) });
  },
};

export default App;
