import m from "mithril";
import { routes } from "./router";
import App from "./components/App";

// Setup routing with the routes configuration
m.route(document.getElementById("app") as HTMLElement, "/", routes);

// Mount the app component
m.mount(document.getElementById("app") as HTMLElement, App);
