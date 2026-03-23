import m from "mithril";
import "material-icons/iconfont/filled.css";
import "mithril-materialized/index.min.css";
import "./css/style.css";
import { registerPlugin } from "mithril-ui-form";
import { assessmentPlugin } from "./components/ui/assessment-plugin";
import { lookupTable, lookupTableCreatorPlugin } from "./components/ui/lookup-table-plugin";
import { tablePlugin } from "./components/ui/table-plugin";
import { routingSvc } from "./services/routing-service";

registerPlugin("assessment", assessmentPlugin);
registerPlugin("lookup-table", lookupTable);
registerPlugin("create-lookup-table", lookupTableCreatorPlugin);
registerPlugin("table", tablePlugin);
import { LANGUAGE, SAVED } from "./utils";
import { type Languages, i18n } from "./services";

document.documentElement.setAttribute("lang", "en");
// document.addEventListener("onload", async () => {
//   await loadData();
// });

window.onbeforeunload = (e) => {
  if (localStorage.getItem(SAVED) === "true") return;
  localStorage.setItem(SAVED, "true");
  e.preventDefault(); // This is necessary for older browsers
};

i18n.addOnChangeListener(async (locale: string) => {
  routingSvc.init();
  document.documentElement.setAttribute("lang", locale);

  m.route(document.body, routingSvc.defaultRoute, routingSvc.routingTable());
});
i18n.init(
  {
    en: { name: "English", fqn: "en-UK", default: true },
    nl: { name: "Nederlands", fqn: "nl-NL" },
  },
  (window.localStorage.getItem(LANGUAGE) || "nl") as Languages,
);
