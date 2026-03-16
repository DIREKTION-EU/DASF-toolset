import m from "mithril";
import "material-icons/iconfont/filled.css";
import "mithril-materialized/index.min.css";
import "./css/style.css";
import { routingSvc } from "./services/routing-service";
import { LANGUAGE, SAVED } from "./utils";
import { type Languages, i18n } from "./services";

document.documentElement.setAttribute("lang", "en");

window.onbeforeunload = (e) => {
  if (localStorage.getItem(SAVED) === "true") return;
  localStorage.setItem(SAVED, "true");
  e.preventDefault(); // This is necessary for older browsers
};

i18n.addOnChangeListener((locale: string) => {
  console.log(`Language loaded`);
  routingSvc.init();
  document.documentElement.setAttribute("lang", locale);

  console.table({
    defaultRoute: routingSvc.defaultRoute,
    routes: routingSvc.routingTable(),
  });
  m.route(document.body, routingSvc.defaultRoute, routingSvc.routingTable());
});
i18n.init(
  {
    en: { name: "English", fqn: "en-UK", default: true },
    nl: { name: "Nederlands", fqn: "nl-NL" },
  },
  (window.localStorage.getItem(LANGUAGE) || "nl") as Languages,
);
