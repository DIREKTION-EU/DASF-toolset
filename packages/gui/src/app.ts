import m from "mithril";
import "material-icons/iconfont/filled.css";
import "mithril-materialized/index.min.css";
import "./css/style.css";
import { registerPlugin } from "mithril-ui-form";
import { assessmentPlugin } from "./components/ui/assessment-plugin";
import {
  lookupTable,
  lookupTableCreatorPlugin,
} from "./components/ui/lookup-table-plugin";
import { tablePlugin } from "./components/ui/table-plugin";
import { routingSvc } from "./services/routing-service";

registerPlugin("assessment", assessmentPlugin);
registerPlugin("lookup-table", lookupTable);
registerPlugin("create-lookup-table", lookupTableCreatorPlugin);
registerPlugin("table", tablePlugin);
import { LANGUAGE, SAVED } from "./utils";
import { type Languages, i18n } from "./services";
import { registerServiceWorker } from "./register-sw";

// Register service worker for PWA support (production only — avoid caching in dev)
if (import.meta.env.DEV) {
  // Ensure dev HMR is never SW-controlled: unregister workers, clear caches, reload once.
  const DEV_SW_CLEANUP_KEY = "DASF_DEV_SW_CLEANED";
  void (async () => {
    try {
      if (!("serviceWorker" in navigator)) return;

      const isControlled = !!navigator.serviceWorker.controller;
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((r) => r.unregister()));

      if ("caches" in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      }

      if (isControlled && !sessionStorage.getItem(DEV_SW_CLEANUP_KEY)) {
        sessionStorage.setItem(DEV_SW_CLEANUP_KEY, "1");
        window.location.reload();
      }
    } catch (err) {
      console.warn("[SW] Dev cleanup failed", err);
    }
  })();
} else {
  registerServiceWorker();
}

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
    de: { name: "Deutsch", fqn: "de-DE" },
    fr: { name: "Français", fqn: "fr-FR" },
    es: { name: "Español", fqn: "es-ES" },
    it: { name: "Italiano", fqn: "it-IT" },
    pl: { name: "Polski", fqn: "pl-PL" },
    pt: { name: "Português", fqn: "pt-PT" },
    sv: { name: "Svenska", fqn: "sv-SE" },
  },
  (window.localStorage.getItem(LANGUAGE) || "en") as Languages,
);
