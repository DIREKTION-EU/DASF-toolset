import m from "mithril";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

export const routes = {
  "/": Home,
  "*": NotFound,
};

export function setupRouter(container: HTMLElement) {
  m.route(container, "/", routes);
}
